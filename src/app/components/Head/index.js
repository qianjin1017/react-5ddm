import React, { useState, Fragment, useEffect } from 'react'
import { NavLink, useHistory, useRouteMatch } from 'react-router-dom'

// redux
import { useStore, useSelector } from 'react-redux'
import { signOut } from '@/store/actions/user'
import { getUserInfo } from '@/store/reducers/user'

// 组件
import SearchAuto from '@/components/SearchAuto'
import Modal from '@/components/Modal'
import Sign from '@/components/Sign'
import Ads from '@/components/Ads'

import { trim } from '@/utils'
import { name, index } from 'Config'

import './style.scss'

export default function Head() {
  let timer = null
  let timerBlur = null
  const [isHide, onHide] = useState(false)
  const [visible, onModal] = useState(false)
  const [showMenu, onMenu] = useState(false)
  const [showSearch, onSearch] = useState(false)
  const [wd, changeSearch] = useState('')
  const [type, Login] = useState('signIn')

  const store = useStore()
  const me = useSelector(state => getUserInfo(state))
  const history = useHistory()
  const { url = '', params = {} } = useRouteMatch()

  const onSignOut = async () => {
    const _signOut = () => signOut()(store.dispatch, store.getState)
    const [, success] = await _signOut()
    if (success) {
      // 退出成功
      localStorage.removeItem('userid')
      localStorage.removeItem('token')
      window.location.reload()
    } else {
      alert('退出失败')
    }
  }

  useEffect(() => {
    return () => {
      clearTimeout(timerBlur)
    }
  })

  const onChange = e => {
    clearTimeout(timer)
    const wd = trim(e.target.value)
    timer = setTimeout(function () {
      changeSearch(wd)
      onHide(true)
    }, 300)
  }

  const onBlur = () => {
    timerBlur = setTimeout(() => onHide(false), 500)
  }

  const onFocus = () => {
    onHide(true)
  }

  const onType = isSign => {
    Login(isSign)
    onModal(true)
  }

  const onPressEnter = e => {
    if (e.which === 13 && wd) {
      history.push(`/search/${wd}`)
    }
  }

  const onSubmit = () => {
    history.push(`/search/${wd}`)
  }

  // 判断为几月新番
  const getCurMonth = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    let m = '10'
    if (month >= 1 && month < 4) {
      m = '01'
    } else if (month >= 4 && month < 7) {
      m = '04'
    } else if (month >= 7 && month < 10) {
      m = '07'
    }
    return year + m
  }

  const { userid, nickname } = me
  const logo = ['', 'gk', 'a8']
  return (
    <Fragment>
      <header>
        <div className='wp'>
          <NavLink styleName={`header-logo ${logo[index]}`} exact to='/' title={name} />
          <nav styleName={showMenu ? 'show' : ''}>
            <div styleName='header-nav'>
              <NavLink styleName={url === '/' ? 'active' : ''} exact to='/'>
                首页
              </NavLink>
              <NavLink styleName={/dongman|subject|play|week|type|search/.test(url) ? 'active' : ''} exact to='/dongman'>
                动漫
              </NavLink>
              <NavLink styleName={/news|article/.test(url) ? 'active' : ''} exact to='/news'>
                新闻
              </NavLink>
              <NavLink styleName={/ep/.test(url) ? 'active' : ''} exact to='/ep'>
                剧情
              </NavLink>
              <NavLink styleName={/game/.test(url) ? 'active' : ''} exact to='/game'>
                游戏
              </NavLink>
              <NavLink styleName={/top/.test(url) ? 'active' : ''} exact to='/top'>
                排行榜
              </NavLink>
              <NavLink styleName={url === '/new' ? 'active' : ''} exact to='/new'>
                更新
              </NavLink>
              <NavLink styleName={/month/.test(url) ? 'active' : ''} exact to={`/month/${getCurMonth()}`}>
                {getCurMonth().substring(5)}月新番
              </NavLink>
              <NavLink styleName={url === '/simple' ? 'active' : ''} exact to='/simple'>
                简洁版
              </NavLink>
            </div>
          </nav>
          <div styleName={`header-search ${showSearch ? 'show' : ''}`}>
            <input
              required
              type='search'
              placeholder={params.wd || '片名、导演、声优、原作...'}
              onChange={onChange}
              onBlur={onBlur}
              onFocus={onFocus}
              onKeyPress={onPressEnter}
            />
            <button disabled={!wd} onClick={onSubmit}>
              <i className='iconfont'>&#xe78d;</i>
            </button>
            {isHide ? <SearchAuto wd={wd} /> : null}
          </div>
          <div styleName='header-tool' className='tar'>
            <a onClick={() => onSearch(!showSearch)} styleName='on-search'>
              搜索
            </a>
            {nickname ? <span>{nickname}</span> : null}
            {userid ? (
              <a onClick={() => onSignOut()}>退出</a>
            ) : (
              <Fragment>
                <a onClick={() => onType('signIn')}>登录</a>
                <a onClick={() => onType('signUp')}>注册</a>
              </Fragment>
            )}
            <a onClick={() => onMenu(!showMenu)} styleName='on-menu'>
              菜单
            </a>
          </div>
        </div>
      </header>
      <Modal visible={visible} showModal={() => onModal(true)} closeModal={() => onModal(false)}>
        <Sign isSign={type} onType={val => onType(val)} visible={visible} />
      </Modal>
    </Fragment>
  )
}
