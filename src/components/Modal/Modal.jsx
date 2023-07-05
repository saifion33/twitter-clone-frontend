/* eslint-disable react/prop-types */
import React from 'react'

import { createPortal } from 'react-dom'
import ModalBody from './ModalBody'

const Modal = ({ isOpen, onClose, height, children }) => {
    return (
        <>
            {
                isOpen && createPortal(<ModalBody height={height} onClose={onClose}>{children}</ModalBody>, document.getElementById('portals'))
            }
        </>
    )
}

export default Modal