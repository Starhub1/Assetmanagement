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
    showAssetHistory: showAssetHistory
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
            IMEI: req.params.IMEI
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
    req.checkBody("name", "Name is required.").notEmpty();
    req.checkBody("IMEI", "IMEI is required.").notEmpty();

    // if there are errors, redirect and save errors to flash
    const errors = req.validationErrors();
    if (errors) {
        req.flash("errors", errors.map(err => err.msg));
        return res.redirect("/create");
    }

    // create a new Asset
    const asset = new Asset({
        name: req.body.name,
        IMEI: req.body.IMEI,
        description: req.body.description,
        color: req.body.color,
        Model: req.body.Model,
        OS: req.body.OS,
        RAM: req.body.RAM,
        Storage: req.body.Storage,
        accesories: req.body.accesories,
        owner: req.body.owner,
        email: req.body.email,
        assignedDate: req.body.assignedDate
    });

    // save Asset
    asset.save(err => {
        if (err) throw err;

        // set a successful flash message
        req.flash("success", "Successfuly created Asset!");

        // redirect to the newly created Asset
        res.redirect(`/${asset.IMEI}`);
    });

    //create History table
    const history = new History({
        assetName: req.body.name,
        IMEI: req.body.IMEI
    });

    history.save(err => {
        if (err) throw err;
        console.log("History table added");
    });
}

/**
 * Show the edit form
 */
function showEdit(req, res) {
    Asset.findOne({
            IMEI: req.params.IMEI
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
    if (req.body.name) {
        // validate information
        req.checkBody("name", "Name is required.").notEmpty();
        req.checkBody("IMEI", "IMEI is required.").notEmpty();

        // if there are errors, redirect and save errors to flash
        const errors = req.validationErrors();
        if (errors) {
            req.flash("errors", errors.map(err => err.msg));
            return res.redirect(`/${req.params.IMEI}/edit`);
        }

        // finding a current Asset
        Asset.findOne({
                IMEI: req.params.IMEI
            },
            (err, asset) => {
                // updating that Asset
                (asset.IMEI = req.body.IMEI),
                (asset.name = req.body.name),
                (asset.description = req.body.description),
                (asset.color = req.body.color),
                (asset.Model = req.body.Model),
                (asset.OS = req.body.OS),
                (asset.RAM = req.body.RAM),
                (asset.Storage = req.body.Storage),
                (asset.accesories = req.body.accesories),
                asset.save(err => {
                    if (err) throw err;

                    // success flash message
                    // redirect back to the /Assets
                    req.flash("success", "Successfully updated Asset.");
                    res.redirect(`/${req.params.IMEI}`);
                });
            }
        );
    } else if (req.body.email) {
        let IMEI = req.params.IMEI;
        let owner = req.body.owner;
        let email = req.body.email;
        let fromDate;
        req.checkBody("email", "Email is required.").notEmpty();
        req.checkBody("owner", "Owner is required.").notEmpty();

        // if there are errors, redirect and save errors to flash
        const errors = req.validationErrors();
        if (errors) {
            req.flash("errors", errors.map(err => err.msg));
            //return res.redirect(`/${req.params.IMEI}`);
        }

        // finding a current Asset
        Asset.findOne({
                IMEI: req.params.IMEI
            },
            (err, Asset) => {
                // updating that Asset
                Asset.email = req.body.email;
                Asset.owner = req.body.owner;
                Asset.assignedDate = new Date().toLocaleString();
                fromDate = Asset.assignedDate;

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
                            user: "mohdnasir94@gmail.com",
                            pass: "tina_@!md"
                        }
                    });

                    var mailOptions = {
                        from: "mohdnasir94@gmail.com",
                        to: req.body.email,
                        subject: Asset.name + " has been assigned to you on " + Asset.assignedDate,
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
                            IMEI: IMEI
                        },
                        (err, history) => {
                            if (err) {
                                res.status(404);
                                res.send("Asset not found!");
                            }
                            console.log("IMEI number is" + IMEI);
                            console.log(history.historyArr.length + "is");
                            if (history.historyArr.length > 0) {
                                let data = history.historyArr;
                                console.log(data);
                                data[data.length - 1].toDate = new Date().toLocaleString();
                                data.push({
                                    owner: Asset.owner,
                                    email: Asset.email,
                                    fromDate: Asset.assignedDate,
                                    toDate: ""
                                });
                                history.historyArr = data;
                            } else {
                                let data = {
                                    owner: owner,
                                    email: email,
                                    fromDate: fromDate,
                                    toDate: ""
                                };
                                history.historyArr=data;
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
}

/**
 * Delete an Asset
 */
function deleteAsset(req, res) {
    Asset.remove({
            IMEI: req.params.IMEI
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
            IMEI: req.params.IMEI
        },
        (err, history) => {
            if (err) {
                res.status(404);
                res.send("Asset not found!");
            }

            res.render("pages/assetHistory", {
                history: history,
                success: req.flash("success")
            });
        }
    );
}