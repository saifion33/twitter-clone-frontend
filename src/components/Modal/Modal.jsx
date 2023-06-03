/* eslint-disable react/prop-types */
import React from 'react'

import { createPortal } from 'react-dom'
import ModalBody from './ModalBody'

const Modal = ({ isOpen, onClose, children }) => {
    return (
        <>
            {
                isOpen && createPortal(<ModalBody onClose={onClose}>{children}</ModalBody>, document.body)
            }
        </>
    )
}

export default Modal