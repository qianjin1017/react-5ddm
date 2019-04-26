import React, { PureComponent } from 'react'

import Shell from '@/components/Shell'

import { isMobile } from '@/utils'

@Shell
class OutPic extends PureComponent {
  render() {
    console.log(this.props)
    return isMobile() ? <div /> : <div />
  }
}

export default OutPic
