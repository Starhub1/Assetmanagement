const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create a schema
const historySchema = new Schema({
  Asset_fk:String,
  AssetDescription_fk: String,
  historyArr: [{
    owner: String,
    email: String,
    userType: String,
    fromDate: String,
    toDate: String,
    comment:String
  }]
});

// middleware -----
// make sure that the slug is created from the name
// eventSchema.pre("save", function(next) {
//   this.slug = slugify(this.name);
//   next();
// });

// create the model
const historyModel = mongoose.model("History", historySchema);

// export the model
module.exports = historyModel;

// function to slugify a name
// function slugify(text) {
//   return text
//     .toString()
//     .toLowerCase()
//     .replace(/\s+/g, "-") // Replace spaces with -
//     .replace(/[^\w\-]+/g, "") // Remove all non-word chars
//     .replace(/\-\-+/g, "-") // Replace multiple - with single -
//     .replace(/^-+/, "") // Trim - from start of text
//     .replace(/-+$/, ""); // Trim - from end of text
// }
