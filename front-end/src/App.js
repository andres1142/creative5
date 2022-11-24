import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import { get } from 'mongoose'
import Footer from './components/Footer'

function App() {

    // setup state User
    const [user, setUser] = useState({})
    const [userEntries, setUserEntries] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLogIn, setLogIn] = useState(false)


    //setUp State Entry
    const [date, setDate] = useState('')
    const [moods, setMoods] = useState([])
    const [accomplishments, setAccomplishments] = useState([])
    const [miracle, setMiracle] = useState('')
    const [entry, setEntry] = useState('')


    const [mood, setMood] = useState('')
    const [accomplishment, setAccomplishment] = useState('')


    const [error, setError] = useState('')


    const fetchEntries = async () => {
        try {
            console.log(user)
            const response = await axios.post('/api/entries', { user: user })
            setUserEntries(response.data.entries)
        } catch (error) {
            setError('There was an error trying to fetch items' + error)
        }
    }

    const LogIn = async () => {
        try {
            const response = await axios.post('/api/user', { username: username, password: password })
            setUser(response.data.user)
            setLogIn(response.data.success)
        } catch (error) {
            setError('There was an error trying to log in' + error)
        }
    }

    const AddEntry = async () => {
        try {
            const response = await axios.post('/api/entry', {
                user: user,
                date: date,
                moods: moods,
                accomplishments: accomplishments,
                miracle: miracle,
                entry: entry
            })
            setUserEntries(response.data.entries)
        } catch (error) {
            setError('There was an error trying to add Entry' + error)
        }
    }

    const RemoveEntry = async (entry) => {
        try {
            await axios.delete("/api/entries/" + entry.id);
        } catch (error) {
            setError("error deleting a ticket" + error);
        }
    }

    const checkUser = async (e) => {
        e.preventDefault()
        await LogIn()
        setUserEntries([])
    }

    const newEntry = async (e) => {
        e.preventDefault()
        await AddEntry()
        setAccomplishments([])
        setMoods([])
        setDate('')
        setMiracle('')
        setEntry('')
    }

    const deleteEntry = async (entry) => {
        debugger
        await RemoveEntry(entry)
        await fetchEntries()
    }

    const updateArray = (array, item, type) => {
        array.push(item)

        if (type === 'accomplishment') {
            setAccomplishments(array)
            setAccomplishment('')
        } else {
            setMoods(array)
            setMood('')
        }
    }

    const deleteItemArray = (array, item, type) => {
        let removeIndex = array.indexOf(item);
        if (removeIndex !== -1) {
            array.splice(removeIndex, 1);
            if (type === 'accomplishment') {
                setAccomplishments(array)
            } else {
                setMoods(array)
            }
        }
    }


    function returnJournal() {
        return (
            <div>
                <h3>
                    Welcome back, <i>{user.username}</i>
                </h3>
                <div className='get-journal-holder'>
                    <button className='get-journal-button' type={'button'} onClick={fetchEntries}>Get My Journal</button>
                </div>


                <form onSubmit={newEntry}>
                    <div className='new-entry-text'>
                        New Journal Entry:
                    </div>
                    <div className='journal-form-labels'>
                        <label>
                            Date:
                            <input type={'date'} value={date} onChange={e => setDate(e.target.value)} />
                        </label>

                        <div className='mood-list'>
                            <label>
                                Mood:
                                <input type={'text'} value={mood} onChange={e => setMood(e.target.value)} />
                                <button type={'button'} onClick={e => updateArray(moods, mood, 'mood')}>Add</button>

                                {moods.map(n => (
                                    <div className='mood-item'>
                                        {n}
                                        <button type={'button'} onClick={e => deleteItemArray(moods, n, 'mood')}>-</button>
                                    </div>
                                ))}
                            </label>
                        </div>

                        <label>
                            Miracle:
                            <input type={'text'} value={miracle} onChange={e => setMiracle(e.target.value)} />
                        </label>

                        <div className='accomplishments-list'>
                            <label>
                                Accomplishments:
                                <input type={'Text'} value={accomplishment} onChange={e => setAccomplishment(e.target.value)} />
                                <button type={'button'} onClick={e => updateArray(accomplishments, accomplishment, 'accomplishment')}>Add</button>
                                {accomplishments.map(n => (
                                    <div className='accomplishment_item'>
                                        {n}
                                        <button type={'button'} onClick={e => deleteItemArray(accomplishments, n, 'accomplishment')}>-</button>
                                    </div>
                                ))}
                            </label>
                        </div>
                    </div>


                    <div className='textbox'>
                        Journal Entry
                        <label>
                            <textarea value={entry} onChange={e => setEntry(e.target.value)}></textarea>
                        </label>
                    </div>

                    <div className='add-entry-button'>
                        <input type={'submit'} value={'Add Entry'} />
                    </div>

                </form>

                {userEntries.map(n => (
                    <div className='entrie'>
                        <div className='entrie-row-1'>
                            <div className='date-col'>
                                <strong>Date:</strong> {n.date}
                            </div>
                            <button type={'button'} onClick={e => deleteEntry(n)}>Remove Entry</button>
                        </div>

                        <div className='entrie-row-2'>
                            <div className='mood-col'>
                                <strong>Mood:</strong>
                                {n.moods.map(mood => (
                                    <div>
                                        <div className='mood-item-list'>
                                            {mood}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className='accomplishments_col'>
                                <strong>Accomplishments:</strong>
                                {n.accomplishments.map(item => (
                                    <div>
                                        <div className='mood-item-list'>
                                            {item}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='entrie-row-3'>
                            <strong>Journal Entry</strong>
                            <div className='entry-col'>
                                {n.entry}
                            </div>
                        </div>

                        <div className='entrie-row-4'>
                            <strong>Daily Miracle</strong>
                            <div className='miracle-col'>
                                {n.miracle}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // render results
    return (
        <div className='App'>
            <h2>Welcome to the page were you can keep track your journal, goals and Accomplishments in one place.</h2>

            <p className='instructions-p'>
                You are going to enter a username and a password to access our database. If you don't
                have an account with us, we will keep your information and create an account for you.
                <br /><br />
                Don't forget your password!!
                <br /><br />

                <strong>Date:</strong> Enter the date of the day you are entering your journal entry.<br/><br/>
                <strong>Mood:</strong> Enter how you felt through the day. The more moods the better.<br/><br/>
                <strong>Miracle:</strong> Enter a miracle that made your day a little better.<br/><br/>
                <strong>Accomplishments:</strong> Enter things that you completed throughout the day.<br/><br/>
                <strong>Journal Entry</strong> Here you can write about your day with detail.<br/><br/>


            </p>
            <form onSubmit={checkUser}>
                <div className='log-in-form'>
                    <label>
                        Username:
                        <input type={'text'} value={username} onChange={e => setUsername(e.target.value)} />
                    </label>
                    <label>
                        Password:
                        <input type={'password'} value={password} onChange={e => setPassword(e.target.value)} />
                    </label>
                </div>
                <div className='log-in-button'>
                    <input type={'submit'} value={'Log In'} />
                </div>
            </form>
            <div className='journal-section'>
                {isLogIn ? returnJournal() : null}
            </div>
            <Footer/>
        </div>
    );
}

export default App;