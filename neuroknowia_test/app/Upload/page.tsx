"use client"
import { div } from "framer-motion/client"

import UploadForm from "../Component/Forms/uploadform"
import { Modal, Button, Box } from "@mui/material"
import React, { useState } from "react"
import { useDocumentStore } from "../stores/documentStore"

export default function Upload() {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-gray-50 w-1/3 h-64 rounded flex items-center justify-center">
                <Button
                    variant="outlined"
                    sx={{
                        border: "1px solid black",
                        color: "black",
                        ml: 1
                    }}
                    size="small"
                    type="submit"
                    onClick={handleOpen}
                    className='ml-24 text-violet-600  border-violet-600 border-2 p-2 rounded'
                >
                    Upload
                </Button>

            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white border-2  p-4"> <UploadForm /></Box>



            </Modal>
        </div>

    )
}