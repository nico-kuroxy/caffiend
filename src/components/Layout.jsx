import Authentification from "./Authentification";
import { useState } from "react";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";

export default function Layout(props) {
    const [showModal, setShowModal] = useState(false);
    const {children} = props;
    const {globalUser, logout} = useAuth();
    const header = (
        <header>
            <div>
                <h1 className="text-gradient">CAFFIEND</h1>
                <p>For Coffee Instatiates</p>
            </div>
            {globalUser? 
                (<button onClick={logout}>
                    <p>Log out</p>
                </button>) :
                (<button onClick={() => {
                    setShowModal(true);
                }}>
                    <p>Sign up free!</p>
                    <i className="fa-solid fa-mug-hot"></i>
                </button>)
            }
        </header>
    )
    const footer = (
        <footer>
            <div>
            <p><span className="text-gradient">Caffiend</span> was made by <a target="_blank" href="https://www.smoljames.com">Smoljames</a> using the <a href="https://www.fantacss.smoljames.com" target="_blank">FantaCSS</a> design library.</p>
            <p>Implemented by <a target="_blank" href="https://github.com/nico-kuroxy">Kuroxy</a>.</p>
            </div>
            </footer>
    )

    function handleCloseModal() {
        setShowModal(false);
    }

    return (
        <>
            {showModal && (
                <Modal handleCloseModal={handleCloseModal}>
                    <Authentification handleCloseModal={handleCloseModal}/>
                </Modal>)}
            {header}
            <main>{children}</main>
            {footer}
        </>
    )
} 