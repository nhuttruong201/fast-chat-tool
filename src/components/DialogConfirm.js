import React from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

const DialogConfirm = (props) => {
    let { title, content, cancel, confirm } = props;

    return (
        <>
            <Dialog open={true} aria-labelledby="draggable-dialog-title">
                <DialogTitle
                    style={{ cursor: "move" }}
                    id="draggable-dialog-title"
                >
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>{content}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => cancel()}>
                        Huỷ
                    </Button>
                    <Button onClick={() => confirm()}>Chấp nhận</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DialogConfirm;
