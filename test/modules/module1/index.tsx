import { Module, customModule, Container, VStack } from '@ijstech/components'
import ScomCountDown from '@scom/scom-countdown'
@customModule
export default class Module1 extends Module {
  private countdownEl: ScomCountDown
  private mainStack: VStack

  constructor(parent?: Container, options?: any) {
    super(parent, options)
  }

  async init() {
    super.init()
    this.countdownEl = await ScomCountDown.create({
        id: 'countdown0',
        name: 'My countdown',
        date: '03-30-2023 20:00',
        showUTC: true,
        showFooter: false,
        showHeader: false
    })
    this.mainStack.appendChild(this.countdownEl)
  }

  render() {
    return (
      <i-panel>
        <i-vstack
          id='mainStack'
          margin={{ top: '1rem', left: '1rem' }}
          gap='2rem'
        >
          <i-scom-countdown
            id='countdown1'
            name='Countdown to Launch!'
            date='01/01/2024'
            units="days, hours, minutes"
            showUTC={true}
          ></i-scom-countdown>
        </i-vstack>
      </i-panel>
    )
  }
}
