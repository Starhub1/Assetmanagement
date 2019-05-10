const Asset = require("../models/Assets");
const History = require("../models/History");
const nodemailer = require("nodemailer");

module.exports = {
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
    assignNewOwner: assignNewOwner
};

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
 * Show a single Asset
 */
function showSingle(req, res) {
    // get a single Asset
    Asset.findOne({
        AssetSerial: req.params.AssetSerial
    },
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
    console.log('Asset serial'+req.body.AssetSerial);
    if (req.body.AssetSerial === '')
        req.body.AssetSerial = 'D-' + Date.now();
    // if there are errors, redirect and save errors to flash
    console.log('Asset serial'+req.body.AssetSerial);
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
        givenAccesories: req.body.givenAccesories,
        missingAccessories: req.body.missingAccessories,
        Comments: req.body.Comments
    });

    // save Asset
    asset.save(err => {
        if (err) throw err;

        // set a successful flash message
        req.flash("success", "Successfuly created Asset!");

        // redirect to the newly created Asset
        res.redirect(`/${asset.AssetSerial}`);

        //create History table
        const history = new History({
            AssetDescription: req.body.AssetDescription,
            AssetSerial: req.body.AssetSerial
        });

        history.save(err => {
            if (err) throw err;
            console.log("History Entry added");
        });
    });


}

/**
 * Show the edit form
 */
function showEdit(req, res) {
    Asset.findOne({
        AssetSerial: req.params.AssetSerial
    },
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
    req.checkBody("AssetSerial", "AssetSerial is required.").notEmpty();

    // if there are errors, redirect and save errors to flash
    const errors = req.validationErrors();
    if (errors) {
        req.flash("errors", errors.map(err => err.msg));
        return res.redirect(`/${req.params.AssetSerial}/edit`);
    }

    // finding a current Asset
    Asset.findOne({
        AssetSerial: req.params.AssetSerial
    },
        (err, asset) => {
            // updating that Asset
            (asset.AssetSerial = req.body.AssetSerial),
                (asset.AssetDescription = req.body.AssetDescription),
                (asset.AssetType = req.body.AssetType),
                (asset.AssetSubType = req.body.AssetSubType),
                (asset.givenAccesories = req.body.givenAccesories),
                (asset.missingAccessories = req.body.missingAccessories),
                (asset.Comments = req.body.Comments),
                asset.save(err => {
                    if (err) throw err;

                    // success flash message
                    // redirect back to the /Assets
                    req.flash("success", "Successfully updated Asset.");
                    res.redirect(`/${asset.AssetSerial}`);
                });

            History.findOne({
                AssetSerial: req.params.AssetSerial
            },
                (err, history) => {
                    if (err) throw err;

                    history.AssetDescription = req.body.AssetDescription,
                        history.AssetSerial = req.body.AssetSerial
                    history.save(err => {
                        if (err) throw err;
                        console.log('Updated the history Entry');
                    });
                }
            );
        }
    );

}

/**
 * Delete an Asset
 */
function deleteAsset(req, res) {
    Asset.remove({
        AssetSerial: req.params.AssetSerial
    },
        err => {
            // set flash data
            // redirect back to the Assets page
            req.flash("success", "Asset deleted!");
            res.redirect("/");
        }
    );
}

/**
 * Show Device History
 */

function showAssetHistory(req, res) {
    History.findOne({
        AssetSerial: req.params.AssetSerial
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
    let AssetSerial = req.params.AssetSerial;
    let owner = req.body.owner;
    let email = req.body.email;
    let fromDate;
    req.checkBody("email", "Email is required.").notEmpty();

    // if there are errors, redirect and save errors to flash
    const errors = req.validationErrors();
    if (errors) {
        req.flash("errors", errors.map(err => err.msg));
        //return res.redirect(`/${req.params.AssetSerial}`);
    }

    // finding a current Asset
    Asset.findOne({
        AssetSerial: req.params.AssetSerial
    },
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
                    subject: Asset.AssetDescription + " has been assigned to you on " + Asset.assignedDate,
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
                    AssetSerial: AssetSerial
                },
                    (err, history) => {
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
                                toDate: ""
                            });
                            history.historyArr = data;
                        } else {
                            let data = {
                                owner: owner,
                                email: email,
                                fromDate: fromDate,
                                userType: Asset.userType,
                                toDate: ""
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