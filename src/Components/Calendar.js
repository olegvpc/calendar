import * as React from 'react';
import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 40px;
  align-items: center;
  font-size: 30px;
  line-height: 1.05;
  font-weight: 400;
  //border: 1px solid lightgrey;
  //box-shadow: 2px 2px 2px #eee;
`;
const ButtonAdd = styled.div`
  width: 30px;
  height: 30px;
  background-color: transparent;
  background-image: 
  linear-gradient(90deg, transparent 45%, #EB473D 45%, #EB473D 55%, transparent 55%),
  linear-gradient(180deg, transparent 45%, #EB473D 45%, #EB473D 55%, transparent  55%);
`
const DaysContainer =styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  background-color: #F6F6F6;
  border-top: 1px solid lightgrey;
  border-bottom: 1px solid lightgrey;
`

const DaysItem = styled.div`
  width: 100%;
  font-size: 18px;
  font-weight: normal;
  padding: 10px 25px 5px;
  display: flex;
  justify-content: space-between;
  ${(props)=>
          props.isDayColumn &&
          css`
          padding: 0;
          `
}
`;


const DaysTitle = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  line-height: 1.15;
  
  ${(props) =>
      props.isDate &&
      css`
        font-size: 25px;
        line-height: 1.25;
  `}
  
  ${(props) =>
  props.isToday &&
  css`
    border: 1px solid #EB473D;
    border-radius: 50%;
    background-color: #EB473D;
    color: #FFFFFF;
  `}
  
`;

const Button = styled.div`
  color: #EB473D;
  font-size: 25px;
  cursor: pointer;
`;

const Footer = styled.footer`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 40px;
  align-items: center;
  font-size: 30px;
  line-height: 1.05;
  font-weight: 400;
  background-color: #F6F6F6;
  border-top: 1px solid lightgrey;
`

const ButtonToday = styled.div`
  color: #EB473D;
`
const ButtonDelete = styled.div`
  color: #EB473D;
  display: none;
  
  ${(props) =>
  props.isSelected &&
  css`
    display: block;
  `}
`

const Schedule = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`
const DayColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const Hour = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  font-size: 10px;
  color: lightgray;
  text-align: center;
  border: 1px #F6F6F6 solid;
  border-collapse: collapse;
  ${(props)=>
    props.isEvent &&
        css`
        background-color: #EBECFD;
        `};
  ${(props)=>
    props.isSelected &&
        css`
        background-color: #B3B6F9;
          //border: 1px red solid;
        `}
`;

export function Calendar() {
  const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const TIME = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  const DAYS_OF_THE_WEEK = ['M', 'Tu', 'W', 'Th', 'F', 'Sat', 'Sun'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


  const today = new Date(); // всегда сегодня
  const [date, setDate] = useState(today); // дата в формате Date
  // eslint-disable-next-line
  const [day, setDay] = useState(today.getDay());
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const days = isLeapYear(year) ? DAYS_LEAP : DAYS;

  const [monthArray, setMonthArray] = useState([])
  const [indexOfCurrentWeek, setIndexOfCurrentWeek] = useState(getIndexCurrentWeek(today))


  const [allEventsDayTime, setAllEventsDayTime] = useState([])
  const [isSelectedEvent, setIsSelectedEvent] = useState(false)
  const [eventForDelete, setEventForDelete] = useState([])

  const [isToday, setIsToday] = useState(false)

  const todayWeek = getIndexCurrentWeek(today)
  // console.log("real count week", today, todayWeek)

  useEffect(()=>{
    localStorage.setItem("schedule", JSON.stringify({2023:{'01':{1:[]},
        '02':{1:[]},'03':{1:[]}, '04':{1:[]}, '05':{1:[]}, '06':{1:[]},
      '07':{1:[]},'08':{1:[]}, '09':{1:[]}, '10':{1:[]}, '11':{1:[]}, '12':{1:[]},}}));
    setIsToday(true)
  },[])

  useEffect(()=> {
    if(isToday) {
      setDate(today);
      setDay(today.getDate());
      setMonth(today.getMonth());
      setYear(today.getFullYear());
      setMonthArray(()=> getMonthArray(today));
      setIndexOfCurrentWeek(todayWeek);
      // console.log(today.getDate(), indexOfCurrentWeek)
    }
    // eslint-disable-next-line
  },[isToday])

  useEffect(() => {
    setDay(date.getDate());
    setMonth(date.getMonth());
    setYear(date.getFullYear());
    setMonthArray(()=> getMonthArray(date));
    // eslint-disable-next-line
  }, [date, month]);

  const schedule = {}

  useEffect(()=>{
    localStorage.setItem('events', JSON.stringify(allEventsDayTime));
  },[allEventsDayTime])

  function addToScheduleList(newEvent){
    const scheduleStorage = JSON.parse(localStorage.getItem('schedule'));
    // ===========================
    // console.log(scheduleStorage)
    // ===========================
    const [date, time] = newEvent?.split('T')
    const [year, month, day] = date.split('-')
    const hour = time.split(':')[0]
    // console.log(year, month, day, hour) 2023 04 23 15
    if (!scheduleStorage[year]) {
      console.log(schedule[year])
      scheduleStorage[year] = {[month]: {[day]: [hour]}};
      // console.log(`create year: ${year} - ${month} - ${day} and record one time`, scheduleStorage[year])
    } else if (!scheduleStorage[year][month]) {
      scheduleStorage[year][month] = {[day]: [hour]}
      console.log(`create month: ${month} - ${day} and record one time\``)
    } else if (!scheduleStorage[year][month][day]) {
      scheduleStorage[year][month][day] = [hour]

      // console.log(`create day: ${day} and record one time`)

    } else {
      const scheduleDay = scheduleStorage[year][month][day]
      // eslint-disable-next-line
      scheduleDay.some((item)=> item == hour) ? alert(`Уже назначена встреча на ${year}-${month}-${day} ${hour}:00`) :
      scheduleStorage[year][month][day].push(hour)
    }
    localStorage.setItem('schedule', JSON.stringify(scheduleStorage))
    // console.log(scheduleStorage)
  }


  function getStartDayOfMonth(date) {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return startDate === 0 ? 7 : startDate;
  }

  function getMonthArray(incomDate) {
    const startedDay = getStartDayOfMonth(incomDate)
    const monthArr = Array(days[incomDate.getMonth()] + (startedDay - 1))
    .fill(null)
    .map((_, index) => {const d = index - (startedDay - 2); return d > 0 ? d : ''})
    let monthWeekArr = [];
    for (let i = 0; i <Math.ceil(monthArr.length/7); i++){
    monthWeekArr[i] = monthArr.slice((i*7), (i*7) + 7);
    }
    const needAddDays = 7 - monthWeekArr[monthWeekArr.length-1].length
    for (let i = 0; i < needAddDays; i++) {
      monthWeekArr[monthWeekArr.length-1].push('')
    }
    // console.log(monthWeekArr[monthWeekArr.length-1]) // [24, 25, 26, 27, 28, 29, 30]
    return monthWeekArr
  }

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  // console.log(monthArray.find((item)=> item.find((elem)=> elem === day)), day)
  function getIndexCurrentWeek (incomDate) {
    const day = incomDate.getDate()
    const monthArrayCurrent = getMonthArray(incomDate)
    let indexCurrentWeek = NaN
    monthArrayCurrent.forEach((item, index)=>{
      if(item.find((elem)=> elem === day)){
        indexCurrentWeek = index
      }
    })
    // console.log(incomDate, monthArrayCurrent, day, indexCurrentWeek)
    return indexCurrentWeek
  }

  function handleAddEvent() {
    const dateEventString = prompt('Enter event time:', '2023-04-21 12:00:00');
    try {
      const [date, time] = dateEventString.split(' ');
      const eventDateTime = new Date(`${date}T${time}.000Z`);
      setAllEventsDayTime((prev)=> [...prev, eventDateTime.toJSON()]);
      addToScheduleList(eventDateTime.toJSON())
    } catch (e) {
      alert(`Wrong format date - ${e}`)
    }
  }
  // console.log(schedule)
  function handleSelectEvent(day, hour){
    setIsSelectedEvent((prev)=> !prev)
    if(eventForDelete.length === 0) {
      setEventForDelete((prev)=> [...prev, day])
    } else {
      setEventForDelete([])
    }
    // console.log("select for delete", day, hour, isSelectedEvent)
  }
  function handleDeleteEvent (){
    const yearForDel = Object.keys(eventForDelete[0])
    const monthForDel = Object.keys(eventForDelete[0][yearForDel])
    const dayForDel = Object.keys(eventForDelete[0][yearForDel][monthForDel])
    const hourForDel = eventForDelete[0][yearForDel][monthForDel][dayForDel]
    const dayTime = `${yearForDel}-${monthForDel}-${dayForDel}T${hourForDel}:00:00.000Z`


    const schedule = JSON.parse(localStorage.getItem('schedule'))
    const hoursInSchedule = schedule[yearForDel][monthForDel][dayForDel]

    const newHoursInSchedule = hoursInSchedule.filter(item => item !== hourForDel[0])
    schedule[yearForDel][monthForDel][dayForDel]= newHoursInSchedule
    localStorage.setItem('schedule', JSON.stringify(schedule))


    // console.log("click Delete", eventForDelete, dayTime)
    setAllEventsDayTime((prev) => prev.filter((item)=> item !== dayTime))
    // alert(`Встреча ${dayTime.split('T')} в ${hourForDel[0]} часов удалена`)
    setEventForDelete([])
    setIsSelectedEvent(false)
  }

  function addNullToDate(d){
    if (String(d).length === 2){
      return d
    }
    if(String(d).length === 1){
      return `0${d}`
    }
    return d
  }

  return (
    <>
      <Header>
        <div>Interview Calendar</div>
        <ButtonAdd onClick={() => handleAddEvent()} />
      </Header>
      <DaysContainer>
        <DaysItem>
          {DAYS_OF_THE_WEEK.map((d) => (
            <DaysTitle key={d}>
              {d}
            </DaysTitle>)
          )}
        </DaysItem>
          <DaysItem>
          {monthArray[indexOfCurrentWeek]?.map((d, index) => {
            // console.log(indexOfCurrentWeek)
            return (
              <DaysTitle
                key={index}
                isDate={true}
                // eslint-disable-next-line
                isToday={addNullToDate(d) == today.getDate() && month == today.getMonth() && year == today.getFullYear()}
              >
              {d}
              </DaysTitle>
            )}
          )}
        </DaysItem>

        <DaysItem>
          <Button onClick={() => {
            setIsToday(false)
            if((indexOfCurrentWeek) === 0) {
              setDate(()=> new Date(year, month - 1, 1))
              const prevMonth = getMonthArray(new Date(year, month - 1, 1))
              const indexOfLastWeek = prevMonth.length -1
              setIndexOfCurrentWeek(()=> indexOfLastWeek)
              // console.log('last element', indexOfLastWeek)
            } else if((indexOfCurrentWeek) > 0) {
              setIndexOfCurrentWeek((prev)=> prev - 1)
            }

          }}
          >&lt;</Button>
          <div>
            {MONTHS[month]} {year}
          </div>
          <Button onClick={() => {
            setIsToday(false)
            if ((indexOfCurrentWeek + 1) < monthArray.length) {
              setIndexOfCurrentWeek((prev)=> prev + 1)
            }
            if((indexOfCurrentWeek + 1) === monthArray.length){
              // console.log("the last week of month");
              setIndexOfCurrentWeek(0);
              setDate(new Date(year, month + 1, 1))
            }

          }}
          // (indexOfCurrentWeek + 1) === monthArray.length  setDate(new Date(year, month + 1, day)) : setIndexOfCurrentWeek(0)}
          >&gt;</Button>
        </DaysItem>
      </DaysContainer>
      {/*<p style={{ color: 'blue', fontSize: '15px'}}>{day}-{month}-{year}-{indexOfCurrentWeek} -{isToday? "yes": "no"}</p>*/}
      {/*<p style={{ color: 'blue', fontSize: '15px'}}>monthArray: {JSON.stringify(monthArray)}</p>*/}

      <Schedule>
        {/*<p>{year} - {month}- {JSON.stringify(monthArray[indexOfCurrentWeek])}</p>*/}
        <DaysItem isDayColumn={true}>
          {monthArray[indexOfCurrentWeek]?.map((d, index) => {
            const schedule = JSON.parse(localStorage.getItem('schedule'))

            let scheduleDay =[]
            try{
                if(schedule[year]){
                  // console.log('year OK')
                  if(schedule[year][`0${month+1}`]){
                    // console.log('month OK')
                    if(schedule[year][`0${month+1}`][addNullToDate(d)]){
                      // console.log('day OK', schedule[year][`0${month+1}`][d])
                      const dayList = schedule[year][`0${month+1}`][addNullToDate(d)]
                      dayList.forEach((item)=> scheduleDay.push(item))
                    }
                  }
                }
            } catch (e) {
                console.log(e)
            }

            // console.log(scheduleDay, month, d, )
            // console.log(d, typeof d, month, typeof month) // 17 'number' 3 'number'

            return (
              <DayColumn key={index}>
                {TIME.map((h, index)=>{
                  const isEvent = scheduleDay.some((item)=> item === h.split(':')[0])
                  const objectDay = JSON.stringify({[year]:{[`0${month+1}`]:{[addNullToDate(d)]:[h.split(':')[0]]}}})
                  const objectDeleteEvent = JSON.stringify(eventForDelete[0])

                  return (<Hour
                    key={index}
                    isEvent={isEvent}
                    isSelected={objectDay === objectDeleteEvent}
                    onClick={() => {
                      // console.log(objectDay, objectDeleteEvent)
                      // const hasEventForDellete = eventForDelete.length ? true : false
                      isEvent && handleSelectEvent({[year]:{[`0${month+1}`]:{[addNullToDate(d)]:[h.split(':')[0]]}}}, h.split(':')[0]);
                    }}

                  >
                    {h}
                  </Hour>)
                }

                )}
              </DayColumn>
            )}
          )}
        </DaysItem>

        <p></p>
      </Schedule>

      <Footer>
        <ButtonToday onClick={() => {
          setIsToday(true)
        }
        }>Today
        </ButtonToday>
        <ButtonDelete
          isSelected={isSelectedEvent}
          onClick={() => {
          handleDeleteEvent()
        }
        }>Delete
        </ButtonDelete>
      </Footer>
    </>
  );
}