import React, { useEffect, useState, ReactNode } from 'react'
import AdminSidebar from './adminSidebar'
import AdminMobileSidebar from './adminMobileSidebar'
import Header from './header'
import './layout.scss'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { LOG_OUT, SET_CURRENT_USER } from '../../redux/actions/types';

interface DecodedToken {
  exp: number
}

export default function PrivateLayout({ children }: { children: ReactNode} ) {
  const dispatch = useDispatch()
  const navigator = useNavigate();
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded: DecodedToken = jwtDecode(token)
      dispatch({ type: SET_CURRENT_USER, payload: decoded })
      const interval = setInterval(() => {
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          dispatch({ type: LOG_OUT, payload: {} });
          localStorage.removeItem('token');
          window.location.href = "/login"
        }
      }, 1000 * 60 * 60 * 24);
      return () => clearInterval(interval)
    } else {
      navigator('/')
    }
  }, [])

  const showSidebar = () => {
    setIsOpen((prev) => !prev)
  }
  return (
    <div className='private-layout'>
      <AdminSidebar />
			<div className='page-content'>
				<Header showSideBar={showSidebar} />
        <div style={{display: 'flex'}}>
          <AdminMobileSidebar isOpen={isOpen} setIsOpen={showSidebar} />
          {
            isOpen && <div className='overlay' onClick={showSidebar}>ttt</div>
          }
          
        </div>
				{children}
			</div>
    </div>
  )
}
