
import React from 'react';
import './Counter.css';

function Button({id, children, onClick}){
  return <button id={id} onClick={onClick} className='button'>{children}</button>
}


const initialState = {
    breaktime: 5,
    sessiontime: 25,
    active: 'session',
    timeleft: 25 * 60000, // in miliseconds,
    timer: 0,
  };


// const initialState = {
//   breaktime: 1,
//   sessiontime: 1,
//   active: 'session',
//   timeleft: 0.05 * 60000, // in miliseconds,
//   timer: 0,
// };



export default class Clock extends React.Component {
  constructor(props){
    super(props)
    
    this.state = initialState
    this.INTERVAL = 1000
    this.audioRef = React.createRef()
    this.sessionIndicator = React.createRef()
    this.animationTimer = 0
  }

  startorstop = () => {  
    let {timer} = this.state
    if(timer != 0){ // exists schedule
      clearInterval(timer)
      this.setState({
        timer: 0
      })
    } else { //schedule event 
      let id = setInterval(() => {

          this.setState((prevState) => {
            let {
              active, 
              timeleft, 
              sessiontime,
              breaktime,
            } = prevState
            

            timeleft -= 1000
            if(timeleft == 0){
                this.audioRef.current.volume = 0.2;
                this.audioRef.current.play()
                
            }
            else if (timeleft < 0) {
              active = active === 'session'? 'break': 'session'
              this.sessionIndicator.current.classList.add('active')
              this.animationTimer = setTimeout(() => {
                this.sessionIndicator.current.classList.remove('active')
              }, 1000)
              if (active === 'session'){
                timeleft = sessiontime * 60000
              } else {
                timeleft = breaktime * 60000
              }
            }
            return {
              timeleft,
              active
            }
            
          })
        
      }, this.INTERVAL)
      
      this.setState({
        timer: id
      })
    }
  
  }

  render() {
    let {breaktime, sessiontime, active, timeleft, timer} = this.state
    return (
      <div>
        <div className="config">
          <div>
            <p id="break-label">Break Length</p>
            <Button id="break-increment" onClick={
              () => {
                if (timer)
                  return

                let newtime = breaktime + 1
                if (newtime <= 60){
                  if (active === 'break'){
                    timeleft = newtime * 60000
                  }
                  this.setState({
                    breaktime: newtime,
                    timeleft
                  })
                }
                
              }
            }>+</Button>
            <span id="break-length">{breaktime}</span>
            <Button id="break-decrement" onClick={
              () => {
                if (timer)
                  return

                let newtime = breaktime-1
                if (newtime > 0){
                  if (active === 'break'){
                    timeleft = newtime * 60000
                  }
                  this.setState({
                    breaktime: newtime,
                    timeleft,
                  })
                }
              }
              }>-</Button>
          </div>
          <div>
            <p id="session-label">Session Length</p>
            <Button id="session-increment" onClick={() => {
              if (timer)
                return
              let newtime = sessiontime+1
              if (newtime <= 60){
                if (active === 'session'){
                  timeleft = newtime * 60000
                }
                this.setState({
                  sessiontime: newtime,
                  timeleft,
                })
              }
              
            }}>+</Button>
            <span id="session-length">{sessiontime}</span>
            <Button id="session-decrement" onClick={() => {
              if (timer)
                return
              let newtime = sessiontime-1
              if (newtime > 0){
                if (active === 'session'){
                  timeleft = newtime * 60000
                }
                this.setState({
                  sessiontime: newtime,
                  timeleft,
                })
              }
            }}>-</Button>
          </div>
        </div>
        
        <div>
          <div id='timer-label' ref={this.sessionIndicator}>{active}</div>
          <h1 id="time-left">{formatTime(timeleft)}</h1>
          <audio ref={this.audioRef} id="beep">
            <source src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></source>
          </audio>
        </div>
  
        <div className="btn-group">
          <Button onClick={this.startorstop} id="start_stop"><span className="play"></span><span className="pause"></span></Button>
          <Button id="reset" onClick={()=>{
            if (this.state.timer) {
              clearInterval(this.state.timer)
            }
            if (this.animationTimer != 0){
              clearInterval(this.animationTimer)
              this.animationTimer = 0
            }
            this.sessionIndicator.current.classList.remove('active')
            this.audioRef.current.pause()
            this.audioRef.current.currentTime = 0
            this.setState(initialState)
            
          }}>
            <span id="reset"></span>
          </Button>
        </div>
        
        
      </div>
    )
  }

}


function formatTime(miliseconds){
  let seconds = Math.floor(miliseconds / 1000)
  let minutes = Math.floor(seconds / 60)
  seconds = seconds % 60
  minutes = padTime(minutes)
  seconds = padTime(seconds)
  return `${minutes}:${seconds}`
}

function padTime(time){
  return time < 10? '0' + String(time): String(time)
}
