import { url } from "inspector";

//Store in Variable so I can access value
const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML

//Receive the Event from the server
//Sometimes, you might want to get a callback when the client confirmed the message reception
socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (url) => {
    console.log(url);
})

//Goal: Create a separate event for location sharing messages



//3. Test your work by sharing a location!

//Add Event Listener on submit button
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
   
    $messageFormButton.setAttribute('disabled', 'disabled')
    
    const message = e.target.elements.message.value
    
    socket.emit('sendMessage', message, (error) => {
        //enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        $messageFormButton.removeAttribute('disabled');
        if (error) {
            return console.log(error);
        }

        console.log('Message delivered!')
    });
})

//Add Button Event to get Geolocation API 
$locationButton.addEventListener('click', () => {
   $locationButton.setAttribute('disabled', 'disabled')

    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by browser')
    } 

    navigator.geolocation.getCurrentPosition( (position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
            //1. Setup the client to acknowledgment function
        }, () => {
            $locationButton.removeAttribute('disabled')
            console.log('Location Shared!');
        })
    })
})



