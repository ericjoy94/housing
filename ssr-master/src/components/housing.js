import React, { Component } from 'react';
// import './housing.css';
import moment from 'moment';
import XMLParser from 'react-xml-parser';
import InfiniteScroll from 'react-infinite-scroll-component';

class Housing extends Component {
    constructor(props) {
        super(props);
        this.persons = 0;
        this.currentDate = moment();
        this.state = {
            firstSat: null,
            firstFriday: null,
            secondSat: null,
            secondFriday: null,
            thirdSat: null,
            thirdFriday: null,
            startDate: null,
            endDate: null,
            persons: null,
            totalOfferArray: [],
            missingInput: '',
            count:1
        }
        this.callApi = this.callApi.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addPersons =this.addPersons.bind(this);
        this.deletePerson=this.deletePerson.bind(this);
        this.handleClick =this.handleClick.bind(this);
        this.getXMLValueFromElement=this.getXMLValueFromElement.bind(this);
        this.getImageUrl =this.getImageUrl.bind(this);
        this.getHousing = this.getHousing.bind(this);
        this.firstSat = null;
        this.firstFriday = null;
        this.secondSat = null;
        this.secondFriday = null;
       
    }

    componentDidMount() {
        const dayINeed = 6; // for Saturday
        const today = moment().isoWeekday();
        // if we haven't yet passed the day of the week that I need:
        if (today <= dayINeed) {
            this.firstSat = moment().isoWeekday(dayINeed);
            this.firstFriday = moment().isoWeekday(dayINeed).add(6, 'days');
            this.secondSat = moment().isoWeekday(dayINeed).add(7, 'days');
            this.secondFriday = moment().isoWeekday(dayINeed).add(13, 'days');
            this.thirdSat = moment().isoWeekday(dayINeed).add(14, 'days');
            this.thirdFriday = moment().isoWeekday(dayINeed).add(20, 'days');
            // convert to the date format 
            this.firstSat = moment(this.firstSat).format('DD/MM/YYYY')
            this.firstFriday = moment(this.firstFriday).format('DD/MM/YYYY')
            this.secondSat = moment(this.secondSat).format('DD/MM/YYYY')
            this.secondFriday = moment(this.secondFriday).format('DD/MM/YYYY')
            this.thirdSat = moment(this.thirdSat).format('DD/MM/YYYY')
            this.thirdFriday = moment(this.thirdFriday).format('DD/MM/YYYY')
            this.setState({
                firstSat: this.firstSat,
                firstFriday: this.firstFriday,
                secondFriday: this.secondFriday,
                secondSat: this.secondSat,
                thirdFriday: this.thirdFriday,
                thirdSat: this.thirdSat
            })
        } else {
            // otherwise, give me *next week's* instance of that same day
            console.log('nextWeek', moment().add(1, 'weeks').isoWeekday(dayINeed));
        }
    }

    handleSubmit(){
        let data = {}
        data.persons = this.state.persons;
        data.endDate = this.state.endDate;
        data.startDate = this.state.startDate;
        data.count=this.state.count;
        if (this.state.persons && this.state.endDate && this.state.startDate) {
            this.callApi(data);
        }
        else {
            this.setState({ missingInput: 'Please fill out the necassary fields' })
        }
    }

    //get the list data from the server
    callApi(data){
        console.log('data',data)
        fetch(
            'http://localhost:8080/housing',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data })
            }
        )
            .then(response => response.json())
            .then(responseData => {

                var xml = new XMLParser().parseFromString(responseData.body);    // Assume xmlText contains the example XML
                let totalOfferArray = xml.getElementsByTagName('Offer');
                let moreData=[...this.state.totalOfferArray,...totalOfferArray]
                console.log('newCount', moreData.length)
                this.setState({ count:moreData.length + 1,totalOfferArray: moreData });
            })
            .catch(err => {

            });
    };
    //add people 
    addPersons(){
        this.persons += 1;
        this.setState({ persons: this.persons, missingInput: '' })
    }

    //reduce the no. of persons selected
    deletePerson(){
        if (this.persons === 0) {
            //no data
        }
        else {
            this.persons = this.persons - 1;
            this.setState({ persons: this.persons })
        }
    }

    //function to select the start Date and end Date
    handleClick(sat, fri){
        this.setState({ startDate: sat, endDate: fri, missingInput: false })
    }

    //get the corresponding value of the tags
    getXMLValueFromElement(xmlElement, property){
        if (property && xmlElement.getElementsByTagName(property) &&
            xmlElement.getElementsByTagName(property)[0] &&
            xmlElement.getElementsByTagName(property)[0].value) {
            return xmlElement.getElementsByTagName(property)[0].value;
        }
        return ''
    }

    //for image URL construction
    getImageUrl(xmlElement, property){
        let imageElement = xmlElement.getElementsByTagName('images')[0];
        let baseImageElement = imageElement.getElementsByTagName('base')[0];
        let baseURl = this.getXMLValueFromElement(baseImageElement, 'url');
        let preset = this.getXMLValueFromElement(baseImageElement, 'preset');
        let mainImageName = this.getXMLValueFromElement(imageElement, 'main');
        return 'http://' + baseURl.replace('{preset}', preset) + mainImageName;
    }

    //renders house lists
    getHousing() {
        let totalOfferArray = this.state.totalOfferArray;
        let housingElement = [];
        for (let i = 0; i < totalOfferArray.length; i++) {
            let item = totalOfferArray[i];
            let id = this.getXMLValueFromElement(item, 'id');
            let currency = this.getXMLValueFromElement(item, 'currency');
            let rooms = this.getXMLValueFromElement(item, 'rooms');
            let persons = this.getXMLValueFromElement(item, 'persons');
            let review_score = this.getXMLValueFromElement(item, 'review_score');
            let imagesUrl = this.getImageUrl(item, 'images');
            housingElement.push(
                <div className="boxes">
                    <div className="list">
                        <div key={i}>
                            <div>houseId:{id}</div>
                            <div><img src={imagesUrl} /></div>
                            <div>rooms:{rooms},</div>
                            <div>persons:{persons},</div>
                            <div>review_score:{review_score}, </div>
                            <div>currency:{currency} </div>
                            
                        </div>
                    </div>
                </div>
            )
        }
        return housingElement;
    }

    render() {
        return (
            <div className="housing-style " >
                <div className="my-header" >
                    <div className="input-person col-md-4 col-sm-4">
                        <i className="fa fa-minus" aria-hidden="true" onClick={this.deletePerson}></i>
                        <span>no of persons{this.state.persons}</span>
                        <i className="fa fa-plus" aria-hidden="true" onClick={this.addPersons}></i>
                    </div>
                    <div className="date-block col-md-8 col-sm-8 text-right">
                        <div className="date-section" onClick={() => this.handleClick(this.state.firstSat, this.state.firstFriday)}>
                            <span>{this.state.firstSat} -   </span>
                            <span>{this.state.firstFriday}</span>
                        </div>

                        <div className="date-section" onClick={() => this.handleClick(this.state.secondSat, this.state.secondFriday)}>
                            <span>{this.state.secondSat} -     </span>
                            <span>{this.state.secondFriday}</span>
                        </div>

                        <div className="date-section" onClick={() => this.handleClick(this.state.thirdSat, this.state.thirdFriday)}>
                            <span>{this.state.thirdSat}-</span>
                            <span>{this.state.thirdFriday}</span>
                        </div>
                    </div>
                    <button onClick={this.handleSubmit}>Submit</button>
                    <div>{this.state.missingInput}</div>
                    
                </div>
                <div className="scroll-data">
                <InfiniteScroll 
                dataLength={this.state.totalOfferArray.length}
                next={this.handleSubmit}
                hasMore={true}
                
                >{this.getHousing()}</InfiniteScroll></div>
            </div>
        );
    }
}

export default Housing;
