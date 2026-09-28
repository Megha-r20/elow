import crypto from "crypto";
import mongoose from "mongoose";

export const applyIdPlugin = (schema, defaultIdFn = () => crypto.randomUUID()) => {
  schema.set("suppressReservedKeysWarning", true);

  // Add _id definition if not defined
  if (!schema.path("_id")) {
    schema.add({
      _id: {
        type: mongoose.Schema.Types.Mixed,
        default: defaultIdFn,
      },
    });
  }

  // Define id virtual with getter and setter
  schema.virtual("id")
    .get(function () {
      return this._id;
    })
    .set(function (v) {
      if (v) this._id = v;
    });

  // Enable virtuals in toJSON and toObject so doc.id is always serialized
  schema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret) => {
      if (ret._id !== undefined) {
        ret.id = String(ret._id);
      }
      return ret;
    },
  });
  schema.set("toObject", {
    virtuals: true,
    transform: (doc, ret) => {
      if (ret._id !== undefined) {
        ret.id = String(ret._id);
      }
      return ret;
    },
  });

  // Normalize query filter: if filter has { id: ... } and not { _id: ... }, map id -> _id
  const normalizeQueryFilter = function () {
    const filter = this.getFilter();
    if (filter) {
      if (filter.id !== undefined && filter._id === undefined) {
        const val = filter.id;
        delete filter.id;
        if (typeof val === "string" && mongoose.Types.ObjectId.isValid(val) && val.length === 24) {
          filter.$or = [{ _id: val }, { _id: new mongoose.Types.ObjectId(val) }, { id: val }];
        } else {
          filter.$or = [{ _id: val }, { id: val }];
        }
      }
      if (Array.isArray(filter.$or)) {
        filter.$or = filter.$or.map((cond) => {
          if (cond && cond.id !== undefined && cond._id === undefined) {
            const { id, ...rest } = cond;
            if (typeof id === "string" && mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
              return { $or: [{ _id: id }, { _id: new mongoose.Types.ObjectId(id) }, { id }], ...rest };
            }
            return { _id: id, ...rest };
          }
          return cond;
        });
      }
      if (Array.isArray(filter.$and)) {
        filter.$and = filter.$and.map((cond) => {
          if (cond && cond.id !== undefined && cond._id === undefined) {
            const { id, ...rest } = cond;
            return { _id: id, ...rest };
          }
          return cond;
        });
      }
    }
  };

  schema.pre(
    [
      "find",
      "findOne",
      "findOneAndUpdate",
      "findOneAndDelete",
      "findOneAndReplace",
      "deleteOne",
      "deleteMany",
      "updateOne",
      "updateMany",
      "countDocuments",
    ],
    normalizeQueryFilter
  );

  // For lean queries, ensure ret.id is populated from ret._id
  const mapLeanId = function (res) {
    if (!res) return;
    if (Array.isArray(res)) {
      for (let i = 0; i < res.length; i++) {
        if (res[i] && res[i]._id !== undefined && res[i].id === undefined) {
          res[i].id = String(res[i]._id);
        }
      }
    } else if (typeof res === "object" && res._id !== undefined && res.id === undefined) {
      res.id = String(res._id);
    }
  };

  schema.post(["find", "findOne", "findOneAndUpdate"], mapLeanId);
};
