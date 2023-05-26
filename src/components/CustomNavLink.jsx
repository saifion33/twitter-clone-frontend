/* eslint-disable react/prop-types */
import React from 'react'
import { NavLink } from 'react-router-dom'

const CustomNavLink = ({ to, children, props }) => {
    return (
        <NavLink to={to} {...props} className={({ isActive }) => { return isActive ? 'font-semibold bg-gray-200 text-2xl flex gap-4 items-center hover:bg-gray-200 rounded-full p-3 ' : 'text-2xl flex gap-4 items-center hover:bg-gray-200 rounded-full p-3' }}  >
            {children}
        </NavLink>
    )
}

export default CustomNavLink