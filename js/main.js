const $ = s => document.querySelector(s)
const $$ = s => document.querySelectorAll(s)

let data = []
/* const data = [{
    title: '常用网站',
    data: [
        {
            name: '饥人谷2',
            url: 'https://jirengu.com'
        },
        {
            name: '知乎',
            url: 'https://zhihu.com'
        }
    ]
}, {
    title: '精品博客',
    data: [{
        name: '阮一峰',
        url: 'https://javascript.ruanyifeng.com'
    }, {
        name: 'mdn',
        url: 'https://developer.mozilla.org/zh-CN/'
    }]
}] */
load()

const searchMap = {
    'baidu': 'https://www.baidu.com/s?wd=',
    'bing': 'https://cn.bing.com/search?='
}
let searchType = 'baidu'
let pageStatus = 'setting'
let curModifyIdx = 0
let $curModify = null

$$('.search-tab').forEach($tab => {
    $tab.onclick = function () {
        $$('.search-tab').forEach($tab => $tab.classList.remove('active'))
        this.classList.add('active')
    }
})

document.onkeyup = function (e) {
    if (e.key === 'Enter') {
        search()
    }
}
$('.icon-search').onclick = function () {
    search()
}

$('.icon-setting').onclick = function () {
    pageStatus = 'setting'
    $('body').classList.remove('preview')
    $('body').classList.add('setting')
}

$('.icon-back').onclick = function () {
    pageStatus = 'preview'
    $('body').classList.remove('setting')
    $('body').classList.add('preview')
}

$('.icon-plus').onclick = function () {
    $('.modal-1').classList.add('show')
}

$('.modal-1 .button-cancel').onclick = function () {
    $('.modal-1').classList.remove('show')
}

$('.modal-2 .button-cancel').onclick = function () {
    $('.modal-2').classList.remove('show')
}

$('.modal-3 .button-cancel').onclick = function () {
    $('.modal-3').classList.remove('show')
}

$('.modal-1 .button-confirm').onclick = function () {
    let value = $('.filed input').value
    if (value === '') {
        alert('输入不能为空')
        return
    }
    let obj = {
        title: value,
        data: []
    }
    data.push(obj)
    render(data)
    save()
    $('.filed input').value = ''
    $('.show').classList.remove('show')
}
$('.modal-2 .button-confirm').onclick = function () {
    let value = $('.modal-2 .filed input').value
    if (value === '') {
        alert('输入不能为空')
        return
    }
    data[curModifyIdx].title = value
    render(data)
    save()
    $('.modal-2 .filed input').value = ''
    $('.modal-2').classList.remove('show')
}

$('.modal-3 .button-confirm').onclick = function () {
    let name = $('.modal-3 .filed input.site-name').value
    let url = $('.modal-3 .filed input.site-url').value
    if (name === '' || url === '') {
        alert('输入不能为空')
        return
    }
    data[curModifyIdx].data.push({name, url})
    render(data)
    save()
    $$('.modal-3 .filed input').forEach($inp => $inp.value = '')
    $('.modal-3').classList.remove('show')
}

$$('.list').forEach($obj => {
    this.onclick = function (e) {
        //console.log(e.composedPath());
        let $delete = e.composedPath().find($node => $node.classList && $node.classList.contains('icon-delete'))
        if ($delete) {
            let $result = e.composedPath().filter($node => $node.classList && $node.classList.contains('item'))
            let $item = $result[0]
            let index = [...$$('.item')].indexOf($item)
            console.log(index);
            data.splice(index, 1)
            render(data)
            save()
        }
        let $edit = e.composedPath().find($node => $node.classList && $node.classList.contains('icon-edit'))
        if($edit){
            let $result = e.composedPath().filter($node => $node.classList&&$node.classList.contains('item'))
            let $item = $result[0]
            let index = [...$$('.item')].indexOf($item)
            curModifyIdx = index
            $curModify = $item
            let title = data[index].title
            $('.modal-2').classList.add('show')
            $('.modal-2 .filed input').value = title
            save()
        }
        let $site = e.composedPath().find($node => $node.classList&&$node.classList.contains('icon-add'))
        if($site){
            let $result = e.composedPath().filter($node => $node.classList&&$node.classList.contains('item'))
            let $item = $result[0]
            let index = [...$$('.item')].indexOf($item)
            curModifyIdx = index
            $('.modal-3').classList.add('show')
        }
        let $shanchu = e.composedPath().find($node => $node.classList&&$node.classList.contains('icon-shanchu'))
        if($shanchu){
            let $tag = $shanchu.parentElement.parentElement
            let tagArr = [...$tag.parentElement.children]
            let tagInx = tagArr.indexOf($tag)
            console.log($tag, tagArr, tagInx);
            let $result = e.composedPath().filter($node => $node.classList&&$node.classList.contains('item'))
            if($result.length > 0){
                let $item = $result[0]
                let index = [...$$('.item')].indexOf($item)
                data[index].data.splice(tagInx, 1)
                save()
                render(data)
                console.log(1);
            }
        }

    }
})

function search() {
    let url = searchMap[searchType] + $('.search-input input').value
    const $link = document.createElement('a')
    $link.setAttribute('href', url)
    $link.setAttribute('target', '_blank')
    $link.click()
}


render(data)
function render(data) {
    const $itemArr = data.map(obj => {
        const $item = document.createElement('li')
        $item.classList.add('item')
        const $h2 = document.createElement('h2')
        $h2.append(obj.title)
        const $iconSpan = document.createElement('span')
        $iconSpan.innerHTML = '<svg class="icon icon-delete icon-search" aria-hidden="true"><use xlink:href="#icon-delete"></use></svg><svg class="icon icon-edit icon-search" aria-hidden="true"><use xlink:href="#icon-edit"></use></svg>'
        $h2.append($iconSpan)
        const $ul = document.createElement('ul')
        $ul.classList.add('panel')
        let $liArray = obj.data.map(item => {
            const $tag = document.createElement('li')
            $tag.classList.add('tag')
            const $icon_shanchu = document.createElement('span')
            $icon_shanchu.innerHTML = '<svg class="icon icon-shanchu" aria-hidden="true"><use xlink:href="#icon-shanchu"></use></svg>'
            const $a = document.createElement('a')
            $a.setAttribute('href', item.url)
            $a.setAttribute('target', '_blank')
            $a.append(item.name)
            $tag.append($a)
            $tag.append($icon_shanchu)
            return $tag
        })
        $ul.append(...$liArray)
        let $icon = document.createElement('li')
        $icon.classList.add('tag')
        $icon.classList.add('icon-add')
        $icon.innerHTML = '<svg class="icon icon-plus" aria-hidden="true"><use xlink:href="#icon-file-plus"></use></svg>'
        $ul.append($icon)
        $item.append($h2, $ul)
        return $item
    })
    $$('#websites .list').forEach(obj => {
        obj.innerHTML = '',
            obj.append(...$itemArr)
    })
}

function save() {
    localStorage.setItem('website', JSON.stringify(data))
    //console.log(data);
}

function load() {
    let storageData = localStorage.getItem('website')
    if(storageData) {
        data = JSON.parse(storageData)
    } else {
        data = []
    }
}
