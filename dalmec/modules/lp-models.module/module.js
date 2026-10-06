(function () {
  var JSPDF_CDN = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js'
  var loadPromise = null

  function loadJsPdf () {
    if (window.jspdf && window.jspdf.jsPDF) {
      return Promise.resolve(window.jspdf.jsPDF)
    }
    if (loadPromise) return loadPromise

    loadPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script')
      s.src = JSPDF_CDN
      s.async = true
      s.onload = function () {
        if (window.jspdf && window.jspdf.jsPDF) resolve(window.jspdf.jsPDF)
        else reject(new Error('jsPDF non disponibile'))
      }
      s.onerror = function () {
        reject(new Error('Impossibile caricare jsPDF'))
      }
      document.head.appendChild(s)
    })
    return loadPromise
  }

  function loadImage (src) {
    if (!src) return Promise.resolve(null)
    src = String(src).replace(/&amp;/g, '&').trim()
    if (!src) return Promise.resolve(null)

    return new Promise(function (resolve) {
      var img = new Image()
      // Same-origin HubSpot CDN: keep CORS so canvas → PDF works
      img.crossOrigin = 'anonymous'
      img.onload = function () {
        resolve(img)
      }
      img.onerror = function () {
        // Retry without CORS flag (some assets block canvas export)
        var img2 = new Image()
        img2.onload = function () { resolve(img2) }
        img2.onerror = function () {
          console.warn('[lp-models] Immagine PDF non caricabile', src)
          resolve(null)
        }
        img2.src = src
      }
      img.src = src
    })
  }

  function findFallbackImageSrc () {
    var hero = document.querySelector('.lp-hero img, section.lp-hero img, .lp-hero__media img')
    if (hero && hero.getAttribute('src')) return hero.getAttribute('src')
    var any = document.querySelector('img[src*="Abbattitore"], img[src*="DALMEC"], img[src*="Dalmec"]')
    if (any && any.getAttribute('src')) return any.getAttribute('src')
    return ''
  }

  function imageToDataUrl (img) {
    var canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth || img.width
    canvas.height = img.naturalHeight || img.height
    if (!canvas.width || !canvas.height) return null
    var ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    try {
      return {
        data: canvas.toDataURL('image/png'),
        format: 'PNG'
      }
    } catch (err) {
      console.warn('[lp-models] Canvas CORS bloccato per immagine PDF', err)
      return null
    }
  }

  function ensureSpace (doc, y, need, marginBottom) {
    var pageH = doc.internal.pageSize.getHeight()
    if (y + need > pageH - marginBottom) {
      doc.addPage()
      return 48
    }
    return y
  }

  function buildPdf (JsPDF, data, img) {
    var doc = new JsPDF({ unit: 'pt', format: 'a4' })
    var pageW = doc.internal.pageSize.getWidth()
    var marginX = 48
    var marginBottom = 48
    var maxW = pageW - marginX * 2
    var y = 56
    var title = data.title || 'Scheda tecnica'
    var codice = data.codice || ''
    var descrizione = data.descrizione || ''
    var specs = data.specs || []
    var specsHeading = data.specs_heading || 'Specifiche tecniche'
    var filename = String(data.filename || ('scheda-' + (codice || 'modello')))
      .replace(/\.pdf$/i, '')
      .replace(/[^\w.-]+/g, '-') + '.pdf'

    var textMaxW = maxW
    var imgBottom = y

    if (img) {
      var imgW = 170
      var ratio = (img.naturalWidth || img.width) / (img.naturalHeight || img.height || 1)
      var imgH = imgW / (ratio || 1)
      if (imgH > 150) {
        imgH = 150
        imgW = imgH * (ratio || 1)
      }
      var converted = imageToDataUrl(img)
      if (converted) {
        doc.addImage(
          converted.data,
          converted.format,
          pageW - marginX - imgW,
          42,
          imgW,
          imgH
        )
        textMaxW = Math.max(180, maxW - imgW - 28)
        imgBottom = 42 + imgH
      }
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(18, 85, 136)
    doc.text('DALMEC', marginX, y)
    y += 18

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(15, 32, 56)
    var titleLines = doc.splitTextToSize(title, textMaxW)
    doc.text(titleLines, marginX, y)
    y += titleLines.length * 20 + 8

    if (codice) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.setTextColor(15, 32, 56)
      doc.text(codice, marginX, y)
      y += 18
    }

    if (descrizione) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(85, 103, 127)
      var descLines = doc.splitTextToSize(descrizione, textMaxW)
      doc.text(descLines, marginX, y)
      y += descLines.length * 13 + 16
    } else {
      y += 8
    }

    y = Math.max(y, imgBottom + 16)

    doc.setDrawColor(220, 228, 236)
    doc.line(marginX, y, pageW - marginX, y)
    y += 22

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(18, 85, 136)
    doc.text(specsHeading, marginX, y)
    y += 20

    if (!specs.length) {
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(10)
      doc.setTextColor(85, 103, 127)
      doc.text('Nessuna specifica disponibile.', marginX, y)
      y += 16
    }

    specs.forEach(function (spec) {
      var key = (spec && spec.chiave) ? String(spec.chiave) : ''
      var val = (spec && spec.valore) ? String(spec.valore) : ''
      if (!key && !val) return

      var colKey = maxW * 0.42
      var colVal = maxW - colKey - 12
      var keyLines = doc.splitTextToSize(key, colKey)
      var valLines = doc.splitTextToSize(val, colVal)
      var rowH = Math.max(keyLines.length, valLines.length) * 13 + 10

      y = ensureSpace(doc, y, rowH, marginBottom)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(55, 71, 90)
      doc.text(keyLines, marginX, y)

      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 32, 56)
      doc.text(valLines, marginX + colKey + 12, y)

      y += rowH
      doc.setDrawColor(232, 238, 244)
      doc.line(marginX, y - 6, pageW - marginX, y - 6)
    })

    var pages = doc.getNumberOfPages()
    for (var p = 1; p <= pages; p++) {
      doc.setPage(p)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(150, 160, 175)
      doc.text(
        'DalMec · ' + (codice || 'modello') + ' · Pagina ' + p + ' / ' + pages,
        pageW - marginX,
        doc.internal.pageSize.getHeight() - 24,
        { align: 'right' }
      )
    }

    doc.save(filename)
  }

  function findPayload (btn) {
    var wrap = btn.closest('.lp-model__dl-wrap')
    var node = wrap
      ? wrap.querySelector('[data-model-pdf-data], .js-model-pdf-data')
      : null
    if (!node) return null
    try {
      return JSON.parse(node.textContent)
    } catch (err) {
      console.error('[lp-models] JSON PDF non valido', err)
      return null
    }
  }

  function setBusy (btn, busy) {
    if (!btn) return
    btn.disabled = !!busy
    btn.setAttribute('aria-busy', busy ? 'true' : 'false')
    var action = btn.querySelector('.lp-model__dl-action')
    if (busy) {
      btn.dataset.labelRestore = action ? action.textContent : btn.textContent
      if (action) action.textContent = 'Generazione…'
      else btn.textContent = 'Generazione PDF…'
    } else if (btn.dataset.labelRestore) {
      if (action) action.textContent = btn.dataset.labelRestore
      else btn.textContent = btn.dataset.labelRestore
      delete btn.dataset.labelRestore
    }
  }

  function onPdfClick (e) {
    var btn = e.target.closest('[data-model-pdf-btn], .js-model-pdf-btn')
    if (!btn) return
    e.preventDefault()

    var data = findPayload(btn)
    if (!data || !data.codice) {
      window.alert('Dati modello non disponibili per il PDF.')
      return
    }

    setBusy(btn, true)
    var imageSrc = data.image_src || findFallbackImageSrc()
    Promise.all([loadJsPdf(), loadImage(imageSrc)])
      .then(function (results) {
        buildPdf(results[0], data, results[1])
      })
      .catch(function (err) {
        console.error(err)
        window.alert('Non è stato possibile generare il PDF. Riprova tra poco.')
      })
      .then(function () {
        setBusy(btn, false)
      })
  }

  function boot () {
    document.addEventListener('click', onPdfClick)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot)
  } else {
    boot()
  }
})()
