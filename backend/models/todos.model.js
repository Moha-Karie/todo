import { Schema, model } from "mongoose";

const todosSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    todoName: {
      type: String,
      required: [true, "Todo Name is required!"],
   
    },

    description: {
      type: String,
      required: [true, "description is required"],
    },

    dueDate: {
      type: Date,
      default: null,
    },

    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low", "Not Prioritized"],
      default: "Not Prioritized",
      // capitalizing first letter
      set: (value) => {
        if (!value) return "Not Prioritized";
        return value
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      },
    },
  },
  {
    timestamps: true,
  }
);

const todosModel = model("todos", todosSchema);

export default todosModel;
