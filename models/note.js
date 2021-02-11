const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NoteSchema = new Schema(
  {
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    content: String,
    title: String,
    contact: [{ type: mongoose.Schema.Types.ObjectId, ref: 'contact' }],
    deal: { type: mongoose.Schema.Types.ObjectId, ref: 'deal' },
    shared_note: { type: mongoose.Schema.Types.ObjectId, ref: 'note' },
    has_shared: Boolean,
    updated_at: Date,
    created_at: Date,
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const Note = mongoose.model('note', NoteSchema);

module.exports = Note;
