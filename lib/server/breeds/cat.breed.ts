import mongoose from "mongoose";
import "@/lib/db";
const { Schema } = mongoose;

export const catSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  avatar_url: {
    type: String,
    default: "https://static.thenounproject.com/png/449586-200.png",
  },
});

const Cat = mongoose.models.Cat || mongoose.model("Cat", catSchema);
export default Cat;
