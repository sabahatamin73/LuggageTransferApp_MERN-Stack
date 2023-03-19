import { Form, Button } from "react-bootstrap";
import {useEffect, useState} from 'react';
import serverURL from "../../configVars";
import countries from '../../data/listOfCountriesAndCities.json';
import '../mySenderPosts/EditSender.css'

// states
const EditForm = ({post, handleClose, handleEdit}) => {
   const [originCountry, setOriginCountry] = useState(post.originCountry);
   const [originCity, setOriginCity] = useState(post.originCity);
   const [destinationCountry, setDestinationCountry] = useState(post.destinationCountry);
   const [destinationCity, setDestinationCity] = useState(post.destinationCity);
   const [expiresOn, setExpiresOn] = useState(post.expiresOn);
   const [weight, setWeight] = useState(post.weight);
   const [volume, setVolume] = useState(post.volume);
   const [willingToPayPerKg, setWillingToPayPerKg] = useState(post.willingToPayPerKg);
   const [items, setItems] = useState(post.items);
   const [comments, setComments] = useState(post.comments);
   const [originCities, setOriginCities] = useState([]);
   const [destinationCities, setDestinationCities] = useState([])
   const [validationError, setValidationError] = useState(null)

   // abstracting individual countries
   const countryList = Object.keys(countries).map(key => ({
      name: key
   }));

   useEffect(()=> {
      setOriginCities(countries[post.originCountry]);
      setDestinationCities(countries[post.destinationCountry]);
   }, [post.originCountry, post.destinationCountry])

   // shows origin cities dropdown wrt country
   function handleOriginCountrySelect(e) {
      const countrySel = e.target.value;
      const citiesSel = countrySel !== "" ? countries[countrySel] : "";
      setOriginCountry(countrySel);
      setOriginCities(citiesSel);
      setOriginCity("");
   }

   // selecting origin city
   function handleOriginCitySelect(e) {
      const citiesSel = e.target.value;
      setOriginCity(citiesSel);
   }

   // shows destination cities dropdown wrt country
   function handleDestinationCountrySelect(e) {
      const countrySel = e.target.value;
      const citiesSel = countrySel !== "" ? countries[countrySel] : "";
      setDestinationCountry(countrySel);
      setDestinationCities(citiesSel);
      setDestinationCity("");
   }

   // selecting destination city
   function handleDestinationCitySelect(e) {
      const citiesSel = e.target.value;
      setDestinationCity(citiesSel);
   }

   // fetching data on submit
   const handleSubmit = (e) => {
      e.preventDefault();
      if(weight <= 0) {
         setValidationError(`Weight can't be less than or equal to zero kg`)
         return;
      }
      if(willingToPayPerKg <= 0) {
         setValidationError(`Willing to pay per kg can't be set less than or equal to zero kg`)
         return;
      }
      if(weight > 30) {
         setValidationError(`Weight can't be greater than 30kgs`)
         return;
      }
      const today = new Date();
      const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      if (expiresOn < date) {
         setValidationError(`Expires on can't be before the current date`)
         return;
      }
      fetch(serverURL + "sender/update",
      {
         mode: 'cors',
         method: 'POST',
         headers: { 'Content-Type':'application/json' },
         body: JSON.stringify({ _id:post._id, originCountry, originCity, destinationCountry, destinationCity, expiresOn, weight, volume, willingToPayPerKg, items, comments}),
         credentials: 'include'
      })
      .then((response) => response.json())
      .then(response => {console.log(response);
         handleEdit(response.editedSenderPost);
         console.log(handleClose)
         handleClose();
      })
      .catch(err => console.log(err));
   }

   return (
      <Form className="editsender" onSubmit={handleSubmit}>
      {validationError && <div className='validationError m-4'>{validationError}</div>}
      <Form.Group>
         <div className='form-dix-option'>
            <label className="form-label">Origin Country: <span className="mandatory"> *</span></label>
            <select className="select-form"
               name="Countries"
               onChange={e => handleOriginCountrySelect(e)}
               value={originCountry}
               required
            >
               <option value="" disabled>Select origin country</option>
               {countryList.map((country, key) => (<option key={key} value={country.name}>{country.name}</option>))}
            </select>
         </div>
         <div>
            <label className="form-label">Origin City:<span className="mandatory"> *</span> </label>
            <select
               className="select-form"
               name="Cities"
               onChange={e => handleOriginCitySelect(e)}
               value={originCity}
               required
            >
               <option value="" disabled>Select origin city</option>
               {originCities.map((city, key) => (<option key={key} value={city}>{city}</option>))}
            </select>
         </div>
      </Form.Group>
      <Form.Group>
         <div>
            <label className="form-label">Destination Country:<span className="mandatory"> *</span> </label>
            <select
            className="select-form"
               name="Countries"
               onChange={e => handleDestinationCountrySelect(e)}
               value={destinationCountry}
               required
               >
               <option value="" disabled>Select destination country</option>
               {countryList.map((country, key) => (<option key={key} value={country.name}>{country.name}</option>))}
            </select>
         </div>
         <div>
            <label className="form-label">Destination City: <span className="mandatory"> *</span></label>
            <select
            className="select-form"
                  name="Cities"
                  onChange={e => handleDestinationCitySelect(e)}
                  value={destinationCity}
                  required
               >
               <option value="" disabled>Select destination city</option>
               {destinationCities.map((city, key) => (<option key={key} value={city}>{city}</option>))}
            </select>
         </div>
      </Form.Group>
      <Form.Group>
      <div>
            <label className="form-label">Expires On: <span className="mandatory"> *</span></label>
            <Form.Control
            className="select-form"
               type="date"
               placeholder="expires on date *"
               name="expiresOn"
               value={new Date(expiresOn).toISOString().slice(0,10)}
               onChange = { (e) => setExpiresOn(e.target.value)}
               required
            />
         </div>
      </Form.Group>
      <Form.Group>
         <div>
            <label className="form-label">Weight: <span className="mandatory"> *</span></label>
            <Form.Control
            className="select-form"
               type="number"
               placeholder="weight *"
               name="weight"
               value={weight}
               onChange = { (e) => setWeight(e.target.value)}
               required
               min="0"
               max="30"
            />
         </div>
      </Form.Group>
      <Form.Group>
         <div>
            <label className="form-label">Volume: <span className="mandatory"> *</span></label>
            <Form.Control
            className="select-form"
               type="text"
               placeholder="volume (For e.g: 6*8) *"
               name="vloume"
               value={volume}
               onChange = { (e) => setVolume(e.target.value)}
            />
         </div>
      </Form.Group>
      <Form.Group>
         <div>
            <label className="form-label">Willing to Pay Per Kg: <span className="mandatory"> *</span></label>
            <Form.Control
            className="select-form"
               type="text"
               placeholder="willing to per/kg *"
               name="willingToPayPerKg"
               value={willingToPayPerKg}
               onChange = { (e) => setWillingToPayPerKg(e.target.value)}
               min="0"
            />
         </div>
      </Form.Group>
      <Form.Group>
         <div>
            <label className="form-label">Items: </label>
            <Form.Control
            className="select-form"
               as="textarea"
               placeholder="items"
               rows={2}
               name="items"
               value={items}
               onChange = { (e) => setItems(e.target.value)}
            />
         </div>
      </Form.Group>
      <Form.Group>
         <div>
            <label className="form-label">Comments: </label>
            <Form.Control
            className="select-form"
               as="textarea"
               placeholder="comments"
               rows={3}
               name="comments"
               value={comments}
               onChange = { (e) => setComments(e.target.value)}
            />
         </div>
      </Form.Group>
      <Button className="editSender" variant="success" type="submit">Edit Sender</Button>
   </Form>
   )
}


export default EditForm;