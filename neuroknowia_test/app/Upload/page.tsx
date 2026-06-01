"use client"
import { div } from "framer-motion/client"
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UploadForm from "../Component/Forms/uploadform"
import { Modal, Button, Box } from "@mui/material"
import React, { useState } from "react"
import { useDocumentStore } from "../stores/documentStore"
import ProcessingHandler from "../Component/ErrorHandling/ProcessingHandler"

export default function Upload() {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className="flex items-center justify-center h-screen">
           
<div className="bg-gray-50 w-1/3 h-64 rounded flex flex-col items-center justify-center p-4">
  <CloudUploadIcon className="text-violet-800 mb-4 text-6xl" />

  <Button
    variant="contained"
    color="primary"
    size="large"
    onClick={handleOpen}
    className="bg-violet-800 hover:bg-violet-700 text-white border-2 border-violet-800 rounded-full px-6 py-3 flex items-center gap-2"
  >
    <CloudUploadIcon /> Upload
  </Button>
</div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-auto  bg-white border-2  p-4"> <ProcessingHandler /></Box>



            </Modal>
        </div>

    )
}