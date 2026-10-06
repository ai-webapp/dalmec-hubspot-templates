(function () {
  var hoverMq = window.matchMedia('(hover: hover) and (pointer: fine)')

  function clearActive (root) {
    var nodes = root.querySelectorAll('.is-active')
    Array.prototype.forEach.call(nodes, function (el) {
      el.classList.remove('is-active')
    })
  }

  function setActive (root, index) {
    clearActive(root)
    if (!index) return
    var sel = '[data-closeup-index="' + index + '"]'
    Array.prototype.forEach.call(root.querySelectorAll(sel), function (el) {
      el.classList.add('is-active')
    })
  }

  function scrollPairIntoView (root, el, index) {
    if (el.hasAttribute('data-closeup-marker')) {
      var item = root.querySelector('[data-closeup-item][data-closeup-index="' + index + '"]')
      if (item && item.scrollIntoView) {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
      return
    }
    if (el.hasAttribute('data-closeup-item')) {
      var marker = root.querySelector('[data-closeup-marker][data-closeup-index="' + index + '"]')
      if (marker && marker.scrollIntoView) {
        marker.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }

  function bindRoot (root) {
    if (root.getAttribute('data-closeup-bound') === 'true') return
    root.setAttribute('data-closeup-bound', 'true')

    function onEnter (e) {
      if (!hoverMq.matches) return
      var el = e.target.closest('[data-closeup-marker], [data-closeup-item]')
      if (!el || !root.contains(el)) return
      setActive(root, el.getAttribute('data-closeup-index'))
    }

    function onLeave (e) {
      if (!hoverMq.matches) return
      var el = e.target.closest('[data-closeup-marker], [data-closeup-item]')
      if (!el || !root.contains(el)) return
      var related = e.relatedTarget
      if (related && el.contains(related)) return
      if (related && root.contains(related)) {
        var pair = related.closest('[data-closeup-marker], [data-closeup-item]')
        if (pair && pair.getAttribute('data-closeup-index') === el.getAttribute('data-closeup-index')) {
          return
        }
      }
      clearActive(root)
    }

    function onFocusIn (e) {
      var el = e.target.closest('[data-closeup-marker], [data-closeup-item]')
      if (!el || !root.contains(el)) return
      setActive(root, el.getAttribute('data-closeup-index'))
    }

    function onFocusOut (e) {
      var related = e.relatedTarget
      if (related && root.contains(related)) {
        var pair = related.closest('[data-closeup-marker], [data-closeup-item]')
        if (pair) return
      }
      // On touch devices keep selection until another tap
      if (!hoverMq.matches) return
      clearActive(root)
    }

    function onActivate (e) {
      var el = e.target.closest('[data-closeup-marker], [data-closeup-item]')
      if (!el || !root.contains(el)) return
      var index = el.getAttribute('data-closeup-index')
      if (!index) return

      // Touch / click: sticky highlight + scroll to pair
      if (!hoverMq.matches) {
        e.preventDefault()
        if (el.classList.contains('is-active') && el.hasAttribute('data-closeup-marker')) {
          clearActive(root)
          return
        }
        setActive(root, index)
        scrollPairIntoView(root, el, index)
        return
      }

      setActive(root, index)
    }

    root.addEventListener('mouseenter', onEnter, true)
    root.addEventListener('mouseleave', onLeave, true)
    root.addEventListener('focusin', onFocusIn)
    root.addEventListener('focusout', onFocusOut)
    root.addEventListener('click', onActivate)
  }

  function boot () {
    var roots = document.querySelectorAll('[data-lp-closeup="true"]')
    Array.prototype.forEach.call(roots, bindRoot)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot)
  } else {
    boot()
  }
})()
