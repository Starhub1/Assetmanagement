const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create a schema
const assetSchema = new Schema({
  name: String,
  IMEI:String,
  description: String,
  color:String,
  Model:String,
  OS:String,
  RAM:String,
  Storage:String,
  accesories:String,
  owner:String,
  email:String,
  assignedDate:Date
});

// middleware -----
// make sure that the slug is created from the name
// eventSchema.pre("save", function(next) {
//   this.slug = slugify(this.name);
//   next();
// });

// create the model
const assetModel = mongoose.model("Asset", assetSchema);

// export the model
module.exports = assetModel;

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
