const Asset = require("../models/Assets");
const History = require("../models/History");
const nodemailer = require("nodemailer");
const CommonUtils = require('./common.utils');

module.exports = {
    showLoginPage:showLoginPage,
    showAssets: showAssets,
    showSingle: showSingle,
    seedAssets: seedAssets,
    showCreate: showCreate,
    processCreate: processCreate,
    showEdit: showEdit,
    processEdit: processEdit,
    deleteAsset: deleteAsset,
    showAssetHistory: showAssetHistory,
    showAssignmentHistory: showAssignmentHistory,
    assignNewOwner: assignNewOwner,
    returnAsset:returnAsset,
    getAssets:getAssets,
    logout:logout
};

/**
 * Show Login page
 */

function showLoginPage(req,res){
    res.render('pages/login');
}

/**
 * Show all Assets
 */
function showAssets(req, res) {
    // get all Assets
    Asset.find({}, (err, assets) => {
        if (err) {
            res.status(404);
            res.send("Assets not found!");
        }

        // return a view with data
        res.render("pages/home", {
            assets: assets,
            success: req.flash("success")
        });

    });
}

/**
 * Get all Assets
 */
function getAssets(req, res) {
    // get all Assets
    Asset.find({}, (err, assets) => {
        if (err) {
            res.status(404);
            res.send("Assets not found!");
        }

        // return a view with data
        res.status(200);
        res.json(assets);
    });
}

/**
 * Show a single Asset
 */
function showSingle(req, res) {
    // get a single Asset
    Asset.findById(req.params.id,
        (err, asset) => {
            if (err) {
                res.status(404);
                res.send("Asset not found!");
            }

            res.render("pages/single", {
                asset: asset,
                success: req.flash("success")
            });

        }
    );
}

/**
 * Seed the database
 */
function seedAssets(req, res) {
    // create some Assets
    const Assets = [{
        name: "iphone 10",
        description: "iphone 10 "
    },
    {
        name: "iPhone 8",
        description: "iphone 8 "
    },
    {
        name: "Samsung Galaxy s10",
        description: "Samsung Galaxy s10"
    },
    {
        name: "iPad Air2 ",
        description: "ipad Air2"
    }
    ];

    // use the Asset model to insert/save
    Asset.remove({}, () => {
        for (asset of Assets) {
            var newAsset = new Asset(asset);
            newAsset.save();
        }
    });

    // seeded!
    res.send("Database seeded!");
}

/**
 * Show the create form
 */
function showCreate(req, res) {
    res.render("pages/create", {
        errors: req.flash("errors")
    });
}

/**
 * Process the creation form
 */
function processCreate(req, res) {
    // validate information
    req.checkBody("AssetDescription", "Name is required.").notEmpty();
    //req.checkBody("AssetSerial", "Asset Serial is required.").notEmpty();
    
    // if there are errors, redirect and save errors to flash
    const errors = req.validationErrors();
    if (errors) {
        req.flash("errors", errors.map(err => err.msg));
        return res.redirect("/create");
    }

    // create a new Asset
    const asset = new Asset({
        AssetDescription: req.body.AssetDescription,
        AssetType: req.body.AssetType,
        AssetSubType: req.body.AssetSubType,
        AssetSerial: req.body.AssetSerial,
        owner: req.body.owner,
        email: req.body.email,
        userType: req.body.userType,
        assignedDate: req.body.assignedDate,
        givenAccessories: req.body.givenAccessories,
        missingAccessories: req.body.missingAccessories,
        Comments: req.body.Comments
    });
   
    // save Asset
    asset.save(err => {
        if (err) throw err;

        // set a successful flash message
        req.flash("success", "Successfully created Asset!");

        // redirect to the newly created Asset
        res.redirect(`/home/${asset.id}`);

        //create History table
        const history = new History({
            AssetDescription_fk: asset.AssetDescription,
            Asset_fk: asset.id
        });

        history.save(err => {
            if (err) throw err;
            console.log("History Entry added");
        });

            CommonUtils.sendEmail('davisolo@cisco.com,sudhsure@cisco.com',`${asset.AssetDescription} Has been added to the inventory on ${new Date()}`,'');
        
    });

}

/**
 * Show the edit form
 */
function showEdit(req, res) {
    Asset.findById(req.params.id,
        (err, asset) => {
            res.render("pages/edit", {
                asset: asset,
                errors: req.flash("errors")
            });
        }
    );
}

/**
 * Process the edit form
 */
function processEdit(req, res) {

    // validate information
    req.checkBody("AssetDescription", "AssetDescription is required.").notEmpty();

    // if there are errors, redirect and save errors to flash
    const errors = req.validationErrors();
    if (errors) {
        req.flash("errors", errors.map(err => err.msg));
        return res.redirect(`/${req.params.AssetSerial}/edit`);
    }

    // finding a current Asset
    Asset.findById(req.params.id,
        (err, asset) => {
            // updating that Asset
            let previousState = JSON.stringify(asset);
            (asset.AssetSerial = req.body.AssetSerial),
                (asset.AssetDescription = req.body.AssetDescription),
                (asset.AssetType = req.body.AssetType),
                (asset.AssetSubType = req.body.AssetSubType),
                (asset.givenAccessories = req.body.givenAccessories),
                (asset.missingAccessories = req.body.missingAccessories),
                (asset.Comments = req.body.Comments),
                asset.save(err => {
                    if (err) throw err;

                    // success flash message
                    // redirect back to the /Assets
                    req.flash("success", "Successfully updated Asset.");
                    res.redirect(`/home/${asset.id}`);
                });

            History.findOne({
                Asset_fk: req.params.id
            },
                (err, history) => {
                    if (err) throw err;

                    history.AssetDescription_fk = req.body.AssetDescription,
                    history.save(err => {
                        if (err) throw err;
                        console.log('Updated the history Entry');
                    });
                }
            );
            if(asset.email=='In Storage'){
                CommonUtils.sendEmail('davisolo@cisco.com,sudhsure@cisco.com',`${asset.AssetDescription} Has been Edited on ${new Date()}`,`Previous State\n ${previousState}\n-----New State---------\n${asset}`,'');
            }else{
                CommonUtils.sendEmail(asset.email,`${asset.AssetDescription} Has been Edited on ${new Date()}`,`Previous State \n${previousState}\n-----New State---------\n${asset}`);
            }

        }
    );

}

/**
 * Delete an Asset
 */
function deleteAsset(req, res) {
    Asset.findOne({
        _id:req.params.id
    },(err,asset)=>{
        CommonUtils.sendEmail('davisolo@cisco.com,sudhsure@cisco.com',`${asset.AssetDescription} Has been deleted from the DB on ${new Date()}`,'');
        Asset.findByIdAndDelete(req.params.id,
            err => {
                // set flash data
                // redirect back to the Assets page
                req.flash("success", "Asset deleted!");
                res.redirect("/");
            }
        );
    });
}

/**
 * Show Device History
 */

function showAssetHistory(req, res) {
    History.findOne({
        Asset_fk: req.params.id
    },
        (err, history) => {
            if (err) {
                res.status(404);
                res.send("History not found!");
            }
            //console.log(history);
            res.render("pages/assetHistory", {
                history: history,
                success: req.flash("success")
            });
        }
    );
}

/**
 *Show Assignment history of all devices  
 */

function showAssignmentHistory(req, res) {

    History.find({

    },
        (err, allHistory) => {
            if (err) {
                res.status(404);
                res.send("History not found!");
            }
            //console.log(allHistory);
            res.render("pages/assignmentHistory", {
                allHistory: allHistory,
                success: req.flash("success")
            });
        }
    );

}
/**
     * Assign New Owner
     */

function assignNewOwner(req, res) {
    let id = req.params.id;
    let owner = req.body.owner;
    let email = req.body.email;
    let comment = req.body.message
    let fromDate;
    req.checkBody("email", "Email is required.").notEmpty();

    // if there are errors, redirect and save errors to flash
    const errors = req.validationErrors();
    if (errors) {
        req.flash("errors", errors.map(err => err.msg));
        //return res.redirect(`/${req.params.AssetSerial}`);
    }

    // finding a current Asset
    Asset.findById(id,
        (err, Asset) => {
            // updating that Asset
            Asset.email = req.body.email;
            Asset.owner = req.body.owner;
            Asset.assignedDate = new Date().toLocaleString();
            fromDate = Asset.assignedDate;
            Asset.userType = req.body.userType;

            Asset.save(err => {
                if (err) throw err;

                // success flash message
                // redirect back to the /Assets
                req.flash("success", "Successfully Assigned the Owner.");
                //res.redirect('/');

                //send a mail
                var transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "cx.mobilemanagement@gmail.com",
                        pass: "Cisco@1234"
                    }
                });

                var mailOptions = {
                    from: "CISCO Mobile Management <cx.mobilemanagement@gmail.com>",
                    to: req.body.email,
                    cc: 'davisolo@cisco.com,sudhsure@cisco.com',
                    subject:`${Asset.AssetDescription} has been assigned to ${req.body.owner} on ${Asset.assignedDate}`,
                    text: req.body.message
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });

                req.flash("success", "Email sent successfully");

                //Update the History Table
                History.findOne({
                Asset_fk: req.params.id
                 },
                    (err, history) => {
                        // console.log('History'+history);
                        if (err) {
                            res.status(404);
                            res.send("Asset not found!");
                        }
                        if (history.historyArr.length > 0) {
                            let data = history.historyArr;
                            data[data.length - 1].toDate = new Date().toLocaleString();
                            data.push({
                                owner: Asset.owner,
                                email: Asset.email,
                                fromDate: Asset.assignedDate,
                                userType: Asset.userType,
                                toDate: "",
                                comment:req.body.message
                            });
                            history.historyArr = data;
                        } else {
                            let data = {
                                owner: owner,
                                email: email,
                                fromDate: fromDate,
                                userType: Asset.userType,
                                toDate: "",
                                comment:req.body.message
                            };
                            history.historyArr = data;
                        }

                        history.save(err => {
                            if (err) throw err;
                            console.log("History table updated");
                        });
                    }
                );
            });
        }
    );
}

/**
 * Logout
 */
function logout(req,res){
        req.logout();
       req.flash('success_msg', 'You are logged out');
        res.redirect('/');
}

/**
 * Return the Asset
 */
function returnAsset(req, res) {
    let id = req.params.id;
    let owner = 'In Storage';
    let email = 'In Storage';
    let comment = 'Returned by the Owner'
    let fromDate;

    // if there are errors, redirect and save errors to flash
    const errors = req.validationErrors();
    if (errors) {
        req.flash("errors", errors.map(err => err.msg));
        return res.redirect(`/`);
    }

    // finding a current Asset
    Asset.findById(id,
        (err, Asset) => {
            //Get Data of the previous owner
            let _owner = Asset.owner;
            let _email = Asset.email;

            // updating that Asset
            Asset.email = email;
            Asset.owner = owner;
            Asset.assignedDate = new Date().toLocaleString();
            Asset.userType = 'NA';
            fromDate = Asset.assignedDate;

            Asset.save(err => {
                if (err) throw err;

                // success flash message
                // redirect back to the /Assets
                req.flash("success", "Asset returned to the Storage successfully.");
                res.redirect('/');

                //send a mail
                var transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "cx.mobilemanagement@gmail.com",
                        pass: "Cisco@1234"
                    }
                });

                var mailOptions = {
                    from: "CISCO Mobile Management <cx.mobilemanagement@gmail.com>",
                    to: _email,
                    cc: 'davisolo@cisco.com,sudhsure@cisco.com',
                    subject:`${Asset.AssetDescription} has been returned back by ${_owner} on ${Asset.assignedDate}`,
                    text: 'Asset Returned Successfully'
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });

                req.flash("success", "Email sent successfully");

                //Update the History Table
                History.findOne({
                Asset_fk: req.params.id
                 },
                    (err, history) => {
                        // console.log('History'+history);
                        if (err) {
                            res.status(404);
                            res.send("Asset not found!");
                        }
                        if (history.historyArr.length > 0) {
                            let data = history.historyArr;
                            data[data.length - 1].toDate = new Date().toLocaleString();
                            data.push({
                                owner: Asset.owner,
                                email: Asset.email,
                                fromDate: Asset.assignedDate,
                                userType: 'NA',
                                toDate: "",
                                comment:'In Storage'
                            });
                            history.historyArr = data;
                        } else {
                            let data = {
                                owner: owner,
                                email: email,
                                fromDate: fromDate,
                                userType: 'NA',
                                toDate: "",
                                comment:'In Storage'
                            };
                            history.historyArr = data;
                        }

                        history.save(err => {
                            if (err) throw err;
                            console.log("History table updated");
                        });
                    }
                );
            });
        }
    );
}