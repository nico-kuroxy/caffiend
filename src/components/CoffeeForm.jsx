import { coffeeOptions } from "../utils"
import { useState } from "react"
import Modal from "./Modal";
import Authentification from "./Authentification";
import { useAuth } from "../context/AuthContext";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function CoffeeForm(props) {
    const [selectedCoffee, setSelectedCoffee] = useState(null);
    const [showCoffeeTypes, setShowCoffeeTypes] = useState(false);
    const [coffeeCost, setCoffeeCost] = useState(0);
    const [hour, setHour] = useState(0);
    const [min, setMin] = useState(0);

    const {isAuthenticated} = props
    const [showModal, setShowModal] = useState(false);
    const {globalData, setGlobalData, globalUser} = useAuth();

    async function handleSubmitForm() {
        if (!isAuthenticated) {
            setShowModal(true);
            return;
        }
        // Only submit the form if it is completed.
        if (!selectedCoffee) {
            return;
        }
        try {
            // Then we are going to create a new data object.
            const newGlobalData = {
                ...(globalData || {})
            }
            const nowTime = Date.now()
            const timeToSubtract = (hour*60*60*1000) + (min*60*100)
            const timeStamp = nowTime-timeToSubtract;
            const newData = {
                name:selectedCoffee,
                cost:coffeeCost
            }
            newGlobalData[timeStamp] = newData
            // Update the global state.
            setGlobalData(newGlobalData)
            // Persist the data in the firebase.
            const userRef = doc(db, "users", globalUser.uid)
            const res = await setDoc(userRef, {
                [timeStamp]: newData
            }, {merge: true})
            // Log everything.
            console.log(timeStamp, selectedCoffee, coffeeCost);
            // Reset the coffee card.
            setSelectedCoffee(null)
            setHour(0)
            setMin(0)
            setCoffeeCost(0)
        } catch (err) {
            console.error(err.message)
        } finally {

        }
    }

    return (
        <>
        {showModal && (
            <Modal handleCloseModal={() => setShowModal(false)}>
                <Authentification handleCloseModal={() => {setShowModal(false)}}/>
            </Modal>)}
            <div className="section-header">
                <i className="fa-solid fa-pencil"/>
                <h2>Start Tracking Today</h2>
            </div>
            <h4>Select coffee type</h4>
            <div className="coffee-grid">
                {coffeeOptions.slice(0, 5).map((option, optionIndex) => {
                    return (
                        <button 
                            onClick={() => {
                                setSelectedCoffee(option.name);
                                setShowCoffeeTypes(false);
                            }}
                            className={"button-card " + (option.name === selectedCoffee ? " coffee-button-selected" : " ")} key={optionIndex}>
                            <h4>{option.name}</h4>
                            <p>{option.caffeine} mg</p>
                        </button>
                    )
                })}
                <button     
                    onClick={() => {                               
                        setSelectedCoffee(null);
                        setShowCoffeeTypes(true);
                    }}
                    className={"button-card " + (showCoffeeTypes ? " coffee-button-selected" : " ")}>
                    <h4>Other</h4>
                </button>
            </div>
            {showCoffeeTypes && (
                <select 
                    onChange={(e) => {
                        setSelectedCoffee(e.target.value);
                    }}
                    id="coffee-list" name="coffee-list">
                        <option value={null}>Select type</option>
                        {coffeeOptions.map((option, optionIndex) => {
                            return (
                                <option value={option.name} key={optionIndex}>
                                    {option.name} ({option.caffeine} mg)
                                </option>
                            )
                        })}
                </select>
            )}
            <h4>Add the cost ($)</h4>
            <input 
                className="w-full" type="number" placeholder={coffeeCost}
                onChange={(e) => {
                    setCoffeeCost(e.target.value);
                }}
            />
            <h4>Time since consumption</h4>
            <div className="time-entry">
                <div>
                    <h6>Hours</h6>
                    <select
                        id="hours-select"
                        onChange={(e) => {
                            setHour(e.target.value);
                        }}
                    >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((hour, hourIndex) => {
                            return (
                                <option key={hourIndex} value={hour}>{hour}</option>
                            )
                        })}

                    </select>
                </div>
                <div>
                    <h6>Mins</h6>
                    <select
                        id="mins-select"
                        onChange={(e) => {
                            setMin(e.target.value);
                        }}
                    >
                        {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((min, minIndex) => {
                            return (
                                <option key={minIndex} value={min}>{min}</option>
                            )
                        })}

                    </select>
                </div>
            </div>
            <button onClick={handleSubmitForm}>
                <p>Add entry</p>
            </button>
        </>
    )
}