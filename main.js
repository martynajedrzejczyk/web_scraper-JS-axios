const axios = require('axios')
const {JSDOM} = require('jsdom') 

axios
	.get('https://www.rossmann.pl/kategoria/Odzywki,8659?Page=1&PageSize=24')
	.then((res) => {
        const {document} = new JSDOM(res.data).window
        const pricesE = document.querySelectorAll('.tile-product__price span:first-child')
        const mlE = document.querySelectorAll('.tile-product__name span span')
        const name = document.querySelectorAll('.tile-product__name strong')
        let title = document.querySelectorAll('.tile-product__name span')

        let titles = []
        const ml = []
        const prices = []
        const names = []
        name.forEach((i) => {names.push(i.textContent)})
        pricesE.forEach((i) => {prices.push(i.innerHTML)})
        mlE.forEach((i) => {ml.push(i.innerHTML)})
        title.forEach((i) => {titles.push(i.textContent)})

        title = []

        for(let i=0; i<titles.length; i++) {
            const ind = titles[i].lastIndexOf(',');
            let str = titles[i].substring(0, ind)
            if(str != "") title.push(str)
        }

        const nazwy = []
        const ceny = []
        for (let i=0; i<title.length; i++) {
            
            price = parseFloat(prices[i].replace(' zł','').replace(',','.'))
            ml1 = parseFloat(ml[i].replace(' ml', ''))
            nazwy.push(names[i] + ' ' + title[i] + ' ' + ml1 +' ml | ' + prices[i] + ' | ')
            ceny.push((price/ml1).toFixed(2))
        }

        let obiekty = []

        for (let i=0; i<ceny.length; i++) {
            obiekty.push({'nazwa':nazwy[i], 'cena':ceny[i]})
        }

        obiekty.sort((a,b) => {
            return ((a.cena < b.cena) ? -1 : ((a.cena == b.cena) ? 0 : 1));
        })

        obiekty.forEach((o) => {
            console.log(o.nazwa + ' ' + o.cena + ' zł/ml')
        })
        
	})
	.catch((error) => {
		console.error(error)
	});