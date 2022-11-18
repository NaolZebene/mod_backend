const mongoose = require('mongoose');


const { Schema, model } = mongoose;


const ListingSchema = new Schema({
    transformer_id: {
        type: String,
        required: true
    },
    status_collection_id: {
        type: String,
        required: true
    },
    streamed_data: {
        type: String,
        required: true
    },
    transformer_table_id: {
        type: String,
        required: true
    },
    command_to_read: {
        type: String,
        required: true
    },
    command_to_write: {
        type: String,
        required: true
    }



})

const ListingTable = mongoose.model('ListingTable', ListingSchema);

CreateTransformer = async function (collection_id) {
    const newTransformerSchema = new Schema({
        Name: {
            type: String,
            required: true
        },
        Serial: {
            type: String,
            required: true
        },
        Location: {
            type: "String",
            required: true
        },
        Rating: [{
            ratingType: String,
            ratingValue: Number
        }],
        files: [
            {
                file_name: String
            }
        ],
        isScheduled: {
            type: Boolean,
            default: false
        },
        Schedule_History: [
            {
                schedule_id: String
            }
        ]

    })

    newTransformerSchema.pre('save', async function (doc) {

    })

    newTransformerSchema.post('save', async function (doc) {
        const status_id = `status${Date.now()}`;
        const Status = await CreateStatus(status_id);
        const stream_id = `stream${Date.now()}`;
        const command_read_id = `commandread${Date.now()}`;
        const command_write_id = `commandwrite${Date.now()}`;
        const command_to_read = await CreateCommandToBeRead(command_read_id)
        const command_to_write = await CreateCommandToWrite(command_write_id)
        await CreateStream(stream_id)

        const associated_tables = {
            transformer_table_id: collection_id,
            transformer_id: doc._id,
            status_collection_id: status_id,
            streamed_data: stream_id,
            command_to_read: command_read_id,
            command_to_write: command_write_id
        }

        console.log(associated_tables)

        const statusdata = {
            Temperature: 0,
            Humudity: 0,
            Voltage: 0,
            Current: 0,
            Oil: 0

        }

        const inserted_listing = new ListingTable(associated_tables);
        const init_status = new Status(statusdata)
        await inserted_listing.save()
        await init_status.save()

    })

    return model(collection_id, newTransformerSchema);
}

function CreateStatus(status_id) {
    const statusSchema = new Schema({
        Temperature: {
            type: Number,
            required: true,
            default: 0
        },
        Humudity: {
            type: Number,
            required: true,
            default: 0
        },
        Voltage: {
            type: Number,
            required: true,
            default: 0
        },
        Current: {
            type: Number,
            required: true,
            default: 0
        },
        Oil: {
            type: Number,
            required: true,
            default: 0
        }
    })

    return model(status_id, statusSchema)

}

function CreateStream(stream_id) {
    const streamSchema = new Schema({
        Temperature: {
            type: Number,
        },
        Humudity: {
            type: Number,
        },
        Voltage: {
            type: String,
        },
        Current: {
            type: Number,
        },
        Oil: {
            type: Number,
        },
        Time: {
            type: String,
        }
    }, {
        timestamps: true
    })

    return model(stream_id, streamSchema)
}

function CreateCommandToBeRead(command_read_id) {
    const commandToBeReadSchema = new Schema({
        Command: {
            type: String
        }
    })

    return model(command_read_id, commandToBeReadSchema);
}

function CreateCommandToWrite(command_write_id) {
    const CommandToWrite = new Schema({
        Command: {
            type: String
        }
    })

    return model(command_write_id, CommandToWrite);
}






module.exports = {
    ListingTable,
    CreateTransformer
}
