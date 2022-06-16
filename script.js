const BASE_URL='https://swapi.dev/api/'
const buttonDeleteCheckedElements=getElementByClass('buttonDelete all')
const buttonsDiv=getElementById("buttonsDiv")
const buttonDelete=getElementByClass('buttonDelete')
const checkbox=getElementByClass('checkbox')
const closeButton=getElementByClass('closeButton')
const divWithNoResultText=getElementByClass('divWithNoResultText')
const divTable=getElementById('divTable')
const divExtend=getElementByClass('divExtend')
const header=getElementById('header')
const inputForPagination=getElementByClass('inputForPagination')
const idTd=getElementByClass('id')
const inputSearchByIndex=getElementByClass('inputSearch ByIndex')
const paginationDiv=getElementByClass('paginationDiv')
const resultsAndSearch=getElementById('resultsAndSearch') 
const results=getElementByClass('results')
const resultsDiv=getElementById('resultsDiv')
const searchButton=getElementByClass('buttonSearch ByIndex')
const selectArea=getElementByClass('pageSize')
const spanBetweenPagination=getElementByClass('spanBetweenPagination')
const spanBetweenPaginationText=getElementByClass('spanBetweenPaginationText')
const table=getElementById('table')
const tableAndPagination=getElementById('tableAndPagination')
const trDeleteAllChecked =getElementByClass('trDeleteAllChecked')
const previousPageButton=getElementByClass('paginationButton left')
const nextPageButton=getElementByClass('paginationButton right')
const media=matchMedia('(max-width:1000px)')


media.addEventListener('change',({matches})=>{
    if(matches){
        if (everClicked===1){
            
           previousPageButton[0].lastChild.style.display='none'
           nextPageButton[0].firstChild.style.display='none'
        }
    }
    if (!matches){
        if (everClicked===1){
            
            previousPageButton[0].lastChild.style.display='inline-block'
            nextPageButton[0].firstChild.style.display='inline-block'
         }
    }

})

let buttonDeleteAllExsist=0
let buttonName=''
let collection =null
let collectionArr=null
let extendViewClicked=0
let everClicked=0
let id=0
let inputForPaginationMin=1
let inputForPaginationMax
let isPaginationButton=0
let instances=null
let numberOfPages
let pageNumber=1
let pageSizeValue=10
let resultsValue=0
let pageNumberSupport=pageNumber
let searchByEndpointClicked=0
let searchByIndexClicked=0
let searchByEndpointInputValue=''
let numOfChecked=0


function createElement(element){
    return document.createElement(element)
}
function innerHTML(parent, itemToAdd){
    return parent.innerHTML=itemToAdd
}
function getElementById(id){
    return document.getElementById(id)
}
function addClassList(element,classToAdd){
    element.classList=classToAdd  
} 
function getElementByClass(className){
    return document.getElementsByClassName(className)
}

class Base{
    constructor(created,url,name){
        this.created=created
        this.url=url
        this.name=name
}
}
class People extends Base{
    constructor(name,birth_year,height,gender,created,url){
        super(created,url,name)
        this.birth_year=birth_year
        this.height=height
        this.gender=gender
    }
}
class Planets extends Base{
    constructor(name,terrain,surface_water,climate,created,url){
        super(created,url,name)
        this.terrain=terrain
        this.surface_water=surface_water
        this.climate=climate
    }
}
class Films {
    
    constructor(url,title,episode_id,director,created){
        this.url=url
        this.title=title
        this.episode_id=episode_id
        this.director=director
        this.created=created
        
    }
}
class Species extends Base{
    constructor(name,average_height,classification,language,created,url){
        super(created,url,name)
        this.average_height=average_height
        this.classification=classification
        this.language=language
    }
}
class Vehicles extends Base{
    constructor(name,model,passengers,crew,created,url){
        super(created,url,name)
        this.model=model
        this.passengers=passengers
        this.crew=crew
    }
}
class Strarships extends Base{
    constructor(name,model,length,max_atmosphering_speed,created,url){
        super(created,url,name)
        this.model=model
        this.length=length
        this.max_atmosphering_speed=max_atmosphering_speed
    }
}

async function getDataAndCreateButtons(){

    const  response= await fetch(BASE_URL)
    const data= await response.json()
   
    Object.keys(data).map(key=>{

        const button=createElement('button')
        addClassList(button,'key')
        innerHTML(button,key)

        buttonsDiv.appendChild(button)
        button.addEventListener('click',click)
    })
}

getDataAndCreateButtons()

async function click(){

    removeDivWithNoResultText()
    pageNumber=1
    searchByEndpointClicked=0
    buttonName=this.textContent

    const response=await fetch(`${BASE_URL}${buttonName}`)
    collection=await response.json()

    if (pageSizeValue==10){

       await fetchSpecificPage(pageNumber)
       
    }

    if (pageSizeValue==20){
       
        if (collection.count<10){
            await fetchSpecificPage(pageNumber)
        
        }
        else{

            await  fetch20DataForChangeAt20(pageNumber,pageNumber+1)
        }  
    }
    
   
    createInstances(buttonName)
}

function createInstances(buttonName){
    console.log(pageNumber)

         if(everClicked===0){
   
            everClicked=1
        }
  
      
        if(buttonName==='people'){
    
            instances=collectionArr.map(({name,birth_year,height,gender,created,url})=>
            new People (name,birth_year,height,gender,created,url))     
        }
    
        else if(buttonName==='planets'){
    
            instances=collectionArr.map(({name,terrain,surface_water,climate,created,url})=>
            new Planets (name,terrain,surface_water,climate,created,url))
            
        }
    
        else  if(buttonName==='films'){
    
            instances=collectionArr.map(({url,title,episode_id,director,created})=>
            new Films (url,title,episode_id,director,created))
            
        }
    
        else  if(buttonName==='species'){
    
            instances=collectionArr.map(({name,average_height,classification,language,created,url})=>
            new Species (name,average_height,classification,language,created,url))
              
        } 
    
        else  if(buttonName==='vehicles'){
    
            instances=collectionArr.map(({name,model,passengers,crew,created,url})=>
            new Vehicles (name,model,passengers,crew,created,url))
            
        }
    
        else  if(buttonName==='starships'){
    
            instances=collectionArr.map(({name,model,length,max_atmosphering_speed,created,url})=>
            new Strarships (name,model,length,max_atmosphering_speed,created,url))
           
        } 

        if (everClicked===1){
            clearTable()
            removePagination()
            clearResultsAndSearchDiv()
        }
        
        removeDivWithNoResultText()
        createResultField()
        innerHTML(results,`Results: ${resultsValue}`)
        createSearchFieled()
        createPagination()
        const keys=createHeader(instances)
        createTableBody(instances,keys)         
}

function createHeader(instances){
    
    const rowKeys= Object.keys(instances[0])
    const header=createElement('tr')
    const id=createElement('th')
    const keys=[]

    let initialValue=rowKeys.length-4
    let finishValue=rowKeys.length

    innerHTML(id,'ID')
    addClassList(id,'id')

    header.appendChild(id)

    if(!instances[0].hasOwnProperty('name')){

        initialValue= 1
        finishValue=rowKeys.length-1   
    }
 
    for (i=initialValue;i<finishValue;i++){

        const th = createElement('th')
        const nameOfButton=rowKeys[i].split('_').join(' ').toUpperCase()

        innerHTML(th,nameOfButton)
        header.appendChild(th)

        keys.push(rowKeys[i])    
    } 
    const created=createElement('th')
    const actions=createElement('th')

    addClassList(created,'created')
    addClassList(actions,'actionsTh')
    
    innerHTML(created,'CREATED')
    innerHTML(actions,'ACTIONS')
  
    header.appendChild(created)
    header.appendChild(actions)
    table.appendChild(header)
    keys.push('created','actions')
    return keys  
}

function createTableBody(instances,keys){

    instances.map((element,index)=>{
  
        const tr=createElement('tr')
        const number=createIdNumber(index)
     
        const date=new Date(element.created)
        const readyDate=`${date.getDay()}-${date.getMonth()+1}-${date.getFullYear()}`
        
        tr.appendChild(number)
        for(i=0;i<keys.length-2;i++){

            const td=createElement('td')
            innerHTML(td,element[keys[i]])
            tr.appendChild(td)
        }

        const created=createElement('td')
        const actionsBar=createElement('td')

        addClassList(actionsBar,'actions')
        addClassList(created,'created')

        innerHTML(created,readyDate)

        tr.appendChild(created)
        actionsBar.appendChild(createActionsButton()[0])
        actionsBar.appendChild(createActionsButton()[1])
        tr.appendChild(actionsBar)
        table.appendChild(tr)
    })   
}

function createIdNumber(index){

    const idRow=createElement('td')
    addClassList(idRow,'id')
    
    if (pageNumber<=1){

        innerHTML(idRow,index+1)
        return idRow
    }

    else if (pageNumber>1){

        if (pageSizeValue==20){

            const dif=pageNumber-1
 
            innerHTML(idRow,index+1+dif*20)
            return idRow 
        }

        else{
            innerHTML(idRow,index+1+((pageNumber-1)*10))
            return idRow 
        }
    }
}
 
function createPagination(){  

    if (isPaginationButton===0){

        isPaginationButton=1
      
        const div=createElement('div')
        const previousPageButton=createElement('button')
        const nextPageButton=createElement('button')
        const arrowLeft=createElement('icon')
        const arrowRight=createElement('icon')
        const spanLeft=createElement('span')
        const spanRight=createElement('span')
        const spanBetweenPagination=createElement('span')
        const spanBetweenPaginationText=createElement('span')
        const pageSize=createElement('select')
        const inputForPagination=createElement('input')
        console.log(pageNumber,'pageNumber')
        inputForPagination.value=pageNumber
        
        inputForPagination.setAttribute('type', 'number')
         
        tableAndPagination.appendChild(div)
        div.appendChild(previousPageButton)
        previousPageButton.appendChild(arrowLeft)
        previousPageButton.appendChild(spanLeft)
        div.appendChild(spanBetweenPagination)
        div.appendChild(nextPageButton)
        nextPageButton.appendChild(spanRight)
        nextPageButton.appendChild(arrowRight)
        div.appendChild(pageSize)
        spanBetweenPagination.appendChild(inputForPagination)
        spanBetweenPagination.appendChild(spanBetweenPaginationText)

        
        
        addClassList(pageSize,'pageSize')
        addClassList(inputForPagination,'inputForPagination')
        addClassList(div,'paginationDiv')
        addClassList(previousPageButton,'paginationButton left')
        addClassList(arrowLeft,'icon-left')
        addClassList(spanLeft,'paginationButtonSpan')
        addClassList(nextPageButton,'paginationButton right')
        addClassList(arrowRight,'icon-right')
        addClassList(spanRight,'paginationButtonSpan')
        addClassList(spanBetweenPagination,'spanBetweenPagination')
        addClassList(spanBetweenPaginationText,'spanBetweenPaginationText')


        innerHTML(spanLeft,'PREV')
        innerHTML(spanRight,'NEXT')
    
        for (i=1;i<=2;i++){
            const option=createElement('option')
            innerHTML(option,10*i)
            pageSize.appendChild(option)    
        }

        pageSize.value=pageSizeValue
        numberOfPages=countNumberOfPages(pageSizeValue)
      
        inputForPagination.min=inputForPaginationMin
        inputForPaginationMax=inputForPagination.max=numberOfPages

        innerHTML(spanBetweenPaginationText,` from ${numberOfPages}`)
        
        pageSize.onchange=select   
        nextPageButton.onclick=clickNextPage
        previousPageButton.onclick=clickPreviousPage
        inputForPagination.oninput=setNumberOfPage
    }
}

function createResultField(){

    const results=createElement('p')  
    resultsValue=collection.count

    addClassList(results,'results')

    resultsDiv.appendChild(results)
    
    innerHTML(results,`Results: ${resultsValue}`)

}

async function fetchFullCollection(){

    const response=await fetch(`${BASE_URL}${buttonName}`)
    collection =await response.json()
    collectionArr=collection.results
    pageNumber=1
    searchByEndpointClicked=0
    createInstances(buttonName)
}

function inputSearchByEndpoinPlaceholderText(buttonName){
    if (buttonName==='people'){
        return `search by name`

    }
    else if (buttonName==='films'){
        return `search by title`

    }
    else if (buttonName==='starships'){
        return `search by name or model`

    }
    else if (buttonName==='vehicles'){
        return `search by name or model`

    }
    else if (buttonName==='species'){
        return `search by name`

    }
    else if (buttonName==='planets'){
        return `search by name`

    }


}

function createExtendView(target){

    
    if (collectionArr.length===1){
        console.log(collectionArr)
        id=0
    }
    else {
        idFromTableConvertedToSubstitueIdFromCollection(target)
    }

    if(extendViewClicked===0) {

        extendViewClicked=1

        const div=createElement('div')
        const divForClosingButtonText=createElement('div')
        const tr=createElement('tr')
        const th1=createElement('th')
        const th2=createElement('th')
        const closeButton=createElement('button')
        const crossIcon=createElement('icon')
        const crossIcon2=createElement('icon')
        const tableExtend=createElement('table')
        const text='close--extended--window'
        const collectionForSpecificId=collectionArr[id]
        console.log(collectionForSpecificId,'collectionForSpecificId')

        addClassList(closeButton,'closeButton')
        addClassList(crossIcon,'icon-cancel')
        addClassList(div,'divExtend')
        addClassList(crossIcon2,'icon-cancel')
        addClassList(tableExtend,'tableExtend')

        closeButton.appendChild(crossIcon)
        closeButton.appendChild(divForClosingButtonText)
        closeButton.appendChild(crossIcon2)
        div.appendChild(closeButton)
        divTable.appendChild(div)
        tr.appendChild(th1)
        tr.appendChild(th2)
        tableExtend.appendChild(tr)

        innerHTML(th1,"KEY")
        innerHTML(th2,"VALUE")

        Object.entries(collectionForSpecificId).forEach(([key,value])=>{

            const tr=createElement('tr')
            const td1=createElement('td')
            const td2=createElement('td')

            innerHTML(td1,key)
            innerHTML(td2,value)
        
            tr.appendChild(td1)
            tr.appendChild(td2)

            tableExtend.appendChild(tr)
            closeButton.onclick=closeExtendWindow 
        })
        
        for(i=0;i<text.length;i++){

            const p=createElement('p')
            innerHTML(p,text[i])
            divForClosingButtonText.appendChild(p)
        }

        div.appendChild(tableExtend)
        
    }
     else if  (extendViewClicked===1){

        closeButton[0].style.backgroundColor='var(--red)'
        closeButton[0].style.color='var(--black)'
    
    }
    
    return
}

async function createNewTableAndNumberOfPages(pageNumber1,pageNumber2){
    
    numberOfPages= countNumberOfPages(pageSizeValue)  
    await  fetch20DataForChangeAt20(pageNumber1,pageNumber2)
    clearTable()
    createInstances(buttonName)    
}

async function createNewTableWithNewData(pageNumber1,pageNumber2){

    numberOfPages= countNumberOfPages(pageSizeValue)  

        if(pageSizeValue==20){

            await fetch20DataForChangeAt20(pageNumber1,pageNumber2)
        }
            
        if (pageSizeValue==10){

            await fetchSpecificPage(pageNumber)
        }
            
        clearTable()
        removePagination()
        createInstances(buttonName)
        changeSpanBetweenNextAndPrevButton()
}  
 
function createActionsButton(){

    const buttonExpand=createElement('button')
    const buttonDelete=createElement('button')
    const trashBoxIcon=createElement('icon')
    const plusIcon=createElement('icon')
    const checkbox=createElement('input')
    

    checkbox.setAttribute('type','checkbox')

    addClassList(buttonExpand,`buttonExpand`)
    addClassList(buttonDelete,`buttonDelete`)
    addClassList(trashBoxIcon,'icon-trash')
    addClassList(plusIcon,'icon-plus' )
    addClassList(checkbox,'checkbox')
   
    buttonExpand.appendChild(plusIcon)
    buttonDelete.appendChild(trashBoxIcon)
    buttonDelete.appendChild(checkbox)

    buttonExpand.onclick=targetElement
    buttonDelete.onclick=targetElement
    checkbox.onclick=removeOrAddCheckedAtrribute
    // checkbox.onclick=removeElementWithCheckbox
    return [buttonExpand,buttonDelete]  
}

function countNumberOfPages(pageSizeValue){

    const actuallyCollectionNumberOfPositions=collection.count
    numberOfPages=Math.ceil(actuallyCollectionNumberOfPositions/pageSizeValue)
    return numberOfPages
}

function createSearchFieled(){

    const button=createElement('button')
    resultsAndSearch.appendChild(button)
    button.innerHTML=`SHOW FULL COLLECTION OF ${buttonName.toUpperCase()}`
    addClassList(button,'buttonShowFullCollection')
    button.onclick=fetchFullCollection
    
    for(i=0;i<2;i++){

        const inputSearch=createElement('input')
        const span=createElement('span')
        const button= createElement('button')
        const searchIcon=createElement('icon')
        const classOfElement=i===0? 'ByIndex':'ByEndpoint'
        const typeOfInput=i===0? 'number':"search"

        const placeholderText=i===0? `1 to ${resultsValue}`:inputSearchByEndpoinPlaceholderText(buttonName)

        inputSearch.setAttribute('type', typeOfInput)
        inputSearch.setAttribute('placeholder', placeholderText)
        addClassList(span, 'spanForSearch')
        addClassList(inputSearch,`inputSearch ${classOfElement}`)
        addClassList(button, `buttonSearch ${classOfElement}`)
        addClassList(searchIcon,`icon-search ${classOfElement}`)
        
        button.appendChild(searchIcon)
        span.appendChild(inputSearch)
        span.appendChild(button)
        resultsAndSearch.appendChild(span)  
        
        button.onclick=targetElement

        inputSearch.onfocus=function(){
            this.placeholder=''   
        }
        inputSearch.onblur=function(){
            this.placeholder=placeholderText
            this.border='none'
        }
    }

    
}

async function fetchFilteredByEndpointAndWithSpecificIndex(numberPageToFetch){
    
    const response =await fetch (`${BASE_URL}${buttonName}/?search=+${searchByEndpointInputValue}&page=${numberPageToFetch}`)
    collection= await response.json()
    collectionArr=collection.results
    
       
    createInstances(buttonName)
}

async function fetchFilteredByEndpointAndCreateNewInstances(buttonName){

    // console.log(selectArea[0],'selectArea')
   

    removeDivWithNoResultText()

    const response =await fetch (`${BASE_URL}${buttonName}/?search= ${searchByEndpointInputValue}`)
    collection= await response.json()
    pageSizeValue=10

    if (collection.count===0){
      
        const div=createElement('div')
        inputSearchByIndex[0].disabled=true
        inputSearchByIndex[0].placeholder='----'
        inputSearchByIndex[0].style.border='none'
        searchButton[0].disabled=true
        selectArea[0].disabled=true
        // div.style.color='var(--red)'
            
        addClassList(div,'divWithNoResultText')
        // div.style.textAlign='center'
        tableAndPagination.prepend(div)
        
        innerHTML(div,`I can't find it!`)
        innerHTML(spanBetweenPagination[0],'0')
        innerHTML(results[0],`Results:${collection.count}`)

        clearTable()     
      
    }

    else{

        collectionArr=collection.results
        pageNumber=1
        createInstances(buttonName)
        selectArea[0].setAttribute('disabled',true)
        // pageSizeValue=10
    }   
}

async function searchByEndpoint(target){
    console.log(searchByEndpointClicked,'searchByEndpointClicked')
    
    console.log(searchByEndpointClicked,'searchByEndpointClicked')
    
    if (target.tagName==='SPAN'){
        
        searchByEndpointInputValue=target.firstChild.value
        
        if (searchByEndpointInputValue===''){

            target.firstChild.style.border='3px solid var(--red)'        
            return
        }
        
        else if (buttonName==='people'){
           await  fetchFilteredByEndpointAndCreateNewInstances(buttonName,searchByEndpointInputValue)
        }
        else if (buttonName==='planets'){
            await   fetchFilteredByEndpointAndCreateNewInstances(buttonName,searchByEndpointInputValue)
        }
        else if (buttonName==='films'){
            await   fetchFilteredByEndpointAndCreateNewInstances(buttonName,searchByEndpointInputValue)
        }
        else if (buttonName==='starships'){
            await   fetchFilteredByEndpointAndCreateNewInstances(buttonName,searchByEndpointInputValue)
        }
        else if (buttonName==='vehicles'){
            await   fetchFilteredByEndpointAndCreateNewInstances(buttonName,searchByEndpointInputValue)
        }
        else if (buttonName==='species'){
            await   fetchFilteredByEndpointAndCreateNewInstances(buttonName,searchByEndpointInputValue)
        }

        searchByEndpointClicked=1
        return
    }
    searchByEndpoint(target.parentNode)
}

async function searchByIndex(target){
    
    if (target.tagName==='SPAN'){
        
        const indexFromInput=target.firstChild.value
       
        if ((indexFromInput==='')||(indexFromInput<1)||(indexFromInput>resultsValue)){
           
            target.firstChild.value=''
            target.firstChild.placeholder=`1 to ${resultsValue}` 
            target.firstChild.style.border='3px solid var(--red)'
        
            return 
        }

        else  if  (searchByEndpointClicked===1){

            const collectionPage=+indexFromInput+10
            const numberPageToFetch=collectionPage.toString()[0]
            const indexFromInputLastDigit=indexFromInput[indexFromInput.length-1]
            let indexFromCollection=null
            pageNumber=numberPageToFetch
         
            await  fetchFilteredByEndpointAndWithSpecificIndex(numberPageToFetch)

            if (indexFromInputLastDigit==='0'){
               
                indexFromCollection=9 
            }

            else {

                indexFromCollection=indexFromInputLastDigit-1  
            }
          
            const searchingIdData=collection.results[indexFromCollection]
            const collectionURL=searchingIdData.url
            const response=await fetch(collectionURL) 
            collectionArr=[await response.json()]
           
            target.firstChild.style.backgroundColor='var(--white)'
            target.firstChild.style.border='none'

            createInstances(buttonName)
            innerHTML(idTd[1],indexFromInput)   
            
            selectArea[0].setAttribute('disabled',true) 
            console.log(selectArea)
            return   
        }

        else {
              
            const collectionPage=+indexFromInput+10
            const numberPageToFetch=collectionPage.toString()[0]
            pageNumber=numberPageToFetch
    
            await  fetchSpecificPage(numberPageToFetch)   
    
            const indexFromCollection=indexFromInput[indexFromInput.length-1]
            dataIndexFromcollection =collection.results[+indexFromCollection-1]
            const collectionURL=dataIndexFromcollection.url
            const response=await fetch(collectionURL) 
            collectionArr=[await response.json()]    
               
    
            target.firstChild.style.backgroundColor='var(--white)'
            target.firstChild.style.border='none'
    
            createInstances(buttonName)
            innerHTML(idTd[1],indexFromInput)    
            return   
        }           
    }
     
    searchByIndex(target.parentNode)
}

async function fetchSpecifyIndex(indexFromInput){

    const response=await fetch(`${BASE_URL}${buttonName}/${indexFromInput}/`)
    collectionArr=[await response.json()]
}

async function setNumberOfPage(){   
 
    if (pageSizeValue==10){

        if (this.value>inputForPaginationMax||this.value<inputForPaginationMin){

            this.value=pageNumber
            return       
        }
           
        else {

            pageNumber=this.value
            createNewTableWithNewData()
        }
    }

    if(pageSizeValue==20){

        if (this.value>inputForPaginationMax||this.value<inputForPaginationMin){
    
            this.value=pageNumber
            return       
        }

        pageNumber=this.value
        
        if (pageNumber==numberOfPages){

            if(pageNumber%2!==0){
                
                await fetchSpecificPage(pageNumber*2-1)
                clearTable()
                createInstances(buttonName)     
            }
        }
       
        else {
            
            pageNumber=this.value
            await createNewTableWithNewData(pageNumber*2-1,pageNumber*2)
        } 
    }
}

async function fetch20DataForChangeAt20(pageNumber1,pageNumber2){
    const response1=await fetch(`${BASE_URL}${buttonName}/?page=${pageNumber1}`)
    const data1=await response1.json()
    const response2=await fetch(`${BASE_URL}${buttonName}/?page=${pageNumber2}`)
    const data2=await response2.json()
    
    collectionArr=[...data1.results,...data2.results]
    return data1
}

function changeSpanBetweenNextAndPrevButton(){
    
    inputForPagination[0].value=pageNumber
    innerHTML(spanBetweenPaginationText[0],` from ${numberOfPages}`) 
}

async function select (event){

    pageSizeValue=event.target.value
     
    if (pageSizeValue=='20'){

        if (numberOfPages==1){

            return
        }

        else if (pageNumber===1){

            createNewTableWithNewData(pageNumber,pageNumber+1)
        }

        else if (pageNumber%2===0){

            pageNumber=pageNumber/2
            await createNewTableAndNumberOfPages(pageNumber*2-1,pageNumber*2)
            changeSpanBetweenNextAndPrevButton()
        } 

        else if(!pageNumber%2===0){

            if(pageNumber==numberOfPages){
                
                numberOfPages= countNumberOfPages(pageSizeValue)
                pageNumber=numberOfPages
                changeSpanBetweenNextAndPrevButton()
                fetchSpecificPage(pageNumber*2-1)
                clearTable()
                createInstances(buttonName)
               
            }

            else{
                
                pageNumber=Math.ceil(pageNumber/2)
                createNewTableAndNumberOfPages(pageNumber*2-1,pageNumber*2)  
                changeSpanBetweenNextAndPrevButton()
               } 
            }     
    }  

    if (pageSizeValue=='10'){

        if (pageNumber==1){

            createNewTableWithNewData((pageNumber*2)-1,pageNumber*2)
        } 

        else if (pageNumber%2===0){
          
            pageNumber=pageNumber*2-1
            createNewTableWithNewData((pageNumber*2)-1,pageNumber*2) 
        }   

        else if (!pageNumber%2===0){

            if (pageNumber==numberOfPages){
                pageNumber=pageNumber*2-1
                createNewTableWithNewData()

                changeSpanBetweenNextAndPrevButton()   
            }

            else{

                    pageNumber=pageNumber*2-1
                    createNewTableWithNewData()  
                }
            }
    }
    inputForPagination.max=numberOfPages
}

async function clickPreviousPage(){
    
    if (pageSizeValue==20){
       
        if(pageNumber<=1){

            pageNumber=1 
        } 

        else{
            
            pageNumber--
            createNewTableWithNewData((pageNumber*2)-1,pageNumber*2)
          }  
        }

    if (pageSizeValue==10){

        if  (pageNumber<=1){
    
            pageNumber=1   
            return
        }

        pageNumber--

        if (searchByEndpointClicked===1){


            const response=await fetch (collection.previous)
            collection=await response.json()
            resultsValue=collection.count     
            collectionArr=collection.results
            createInstances(buttonName)
        }

        else{

            createNewTableWithNewData()
        }      
    }  
    if (searchByEndpointClicked===1||searchByIndexClicked===1){
        selectArea[0].setAttribute('disabled',true)
        console.log('klikniete')
    }
}

async function clickNextPage(){

   
    pageNumber++
   
    if (pageSizeValue==20){

        if(pageNumber>=numberOfPages){ 
            pageNumber=numberOfPages

            if (numberOfPages%2===0){

                createNewTableWithNewData((pageNumber*2)-1,pageNumber*2) 
            }  

            else {
                
                changeSpanBetweenNextAndPrevButton()
                await fetchSpecificPage((numberOfPages*2)-1)
                clearTable()
                createInstances(buttonName)    
            }
        }

        else {
            createNewTableWithNewData((pageNumber*2)-1,pageNumber*2)
      
        }      
    }

    else if  (pageSizeValue==10){

        if  (pageNumber>numberOfPages){
            pageNumber=numberOfPages  
           
        }

        else if (searchByEndpointClicked===1){

            const response=await fetch (collection.next)
            collection=await response.json()
            resultsValue=collection.count
            numberOfPages=countNumberOfPages(pageSizeValue)
            collectionArr=collection.results
            createInstances(buttonName)

            }

        else {
            await fetchSpecificPage(pageNumber)
            changeSpanBetweenNextAndPrevButton()
            numberOfPages=countNumberOfPages(pageSizeValue)
    
            clearTable()
            createInstances(buttonName)
        }    
    } 
    if (searchByEndpointClicked===1||searchByIndexClicked===1){
        selectArea[0].setAttribute('disabled',true)
        console.log('klikniete')
    }
}

async function fetchSpecificPage(pageNumber){

        const response=await fetch(`${BASE_URL}${buttonName}/?page=${pageNumber}`)
        collection=await response.json()
        collectionArr=collection.results
}

async function fetchSpecificIndexAfterClickSearchByEndpoint(){
    await fetch(`${BASE_URL}${buttonName}/?search=+`)
}

function idFromTableConvertedToSubstitueIdFromCollection(target){

    const rowIdNumber=(target.firstChild.textContent)-1
    const rowIdString=rowIdNumber.toString()

    if (pageSizeValue==10){
        if (pageNumber>1){

            id=rowIdString[rowIdString.length-1]
        }

        else id=rowIdNumber   
    }

    if(pageSizeValue==20){
        
        if (pageNumber>1){

            const dif= pageNumber-1
            idAfterRefactor= dif*20
            id=rowIdNumber-idAfterRefactor   
        }

        else id=rowIdNumber
    }
    
}

function findExtendButtonTr(target){
  
        if (target.tagName==='TR'){ 
            createExtendView(target)
            return target
        }
        findExtendButtonTr(target.parentNode)
}
           
function closeExtendWindow(){
    extendViewClicked=0
        divTable.removeChild(this.parentNode)
}

function findTargetActionsBar(target){

    if(target.tagName==='TD'){
        
        const div1=createElement('div')
        const div2=createElement('div')
        const yes=createElement('button')
        const no=createElement('button')
        const areUsureText=createElement('span')

        addClassList(div1,'divLeft')
        addClassList(div2,'divRight')
        addClassList(yes,'button yes')
        addClassList(no,'button no')
        addClassList(areUsureText,'areUsureText')
     
        innerHTML(areUsureText,'Are You sure?') 
        innerHTML(yes,'YES') 
        innerHTML(no,'NO') 
        innerHTML(target,'') 
      
        div1.appendChild(areUsureText)
        div2.appendChild(yes)
        div2.appendChild(no)  

        target.appendChild(div1)
        target.appendChild(div2)

        
        yes.onclick=removeRow
        no.onclick=function(){
            innerHTML(target,'')
            target.appendChild(createActionsButton()[0])
            target.appendChild(createActionsButton()[1])   
         } 
        return     
    }
    findTargetActionsBar(target.parentNode)  
}

function removeRow(){
    const tr=this.parentNode.parentNode.parentNode
    table.removeChild(tr)
}

function targetElement(event){

    const target=event.target

    if (target.classList.contains('buttonDelete')||target.classList.contains('icon-trash')){
        if (buttonDeleteAllExsist===1){
            findCheckbox(target)
        }
        
        findTargetActionsBar(target)
    }

    else if (target.classList.contains('buttonExpand')||target.classList.contains('icon-plus')){ 
         console.log(target.tagName) 
       
        findExtendButtonTr(target)
    }

    else if (target.classList.contains('ByIndex')){

        searchByIndex(target)
    }
    
    else if (target.classList.contains('ByEndpoint')){

        searchByEndpoint(target)
        searchByEndpointClicked=1
    }
     
}

function findCheckbox(target){
    
// console.log(target)
    if (target.tagName==='BUTTON'){

        const checkbox=target.children[1]
        console.log(checkbox)
        
        if(checkbox.hasAttribute('checked')){
            checkbox.removeAttribute('checked',false)
            numOfChecked--
            console.log(numOfChecked)
            if (numOfChecked===0){

                buttonDeleteAllExsist=0
                table.removeChild(trDeleteAllChecked[0])
                
            }

            checkbox.removeAttribute('checked',false)
        }

        return
    }
 findCheckbox(target.parentNode)

}
    
function clearTable(){
    innerHTML(table,'') 

    if(extendViewClicked===1){

        extendViewClicked=0
        divTable.removeChild(divExtend[0])      
    }
}

function removePagination(){

    if (isPaginationButton===1){
      
        tableAndPagination.removeChild(paginationDiv[0])
        isPaginationButton=0
    }
}

function clearResultsAndSearchDiv(){
   innerHTML(resultsAndSearch,'')
   innerHTML(resultsDiv,'')

}

function createButtonForAllChecked(){
  
        if (table.contains(trDeleteAllChecked[0])){
            table.removeChild(table.lastChild)
        }
      
        const tr=createElement('tr')
     
        const buttonDeleteCheckedElements=createElement('button')
        const trashBoxIcon=createElement('icon')
       
        addClassList(tr,'trDeleteAllChecked')
      
        addClassList(trashBoxIcon,'icon-trash')
        addClassList(buttonDeleteCheckedElements,'buttonDelete all')
        buttonDeleteCheckedElements.appendChild(trashBoxIcon)
      
        tr.appendChild(buttonDeleteCheckedElements)
        table.appendChild(tr)

   

    buttonDeleteCheckedElements.onclick=createYesOrNoButtonForAllChecked

}

function removeOrAddCheckedAtrribute(){  

    if (buttonDeleteAllExsist===0){

        createButtonForAllChecked()   
    }
    
    if (this.hasAttribute('checked')){

        numOfChecked--

        if (numOfChecked===0){
          
            buttonDeleteAllExsist=0
            console.log(trDeleteAllChecked[0],'trDeleteAllChecked')
            table.removeChild(trDeleteAllChecked[0])
            
        }
        this.removeAttribute('checked',false)
        
        console.log('--1',numOfChecked)
    }

    else {
        
        numOfChecked++

        if (numOfChecked>0){
            buttonDeleteAllExsist=1
        }
        this.setAttribute('checked',true)
        
        console.log('++1',numOfChecked)
    }  
}

function createYesOrNoButtonForAllChecked(){

    const div=createElement('div')
    const yes=createElement('button')
    const no=createElement('button')
    const areUsureText=createElement('span')
    const tr=this.parentNode


    tr.removeChild(this) 
    
   
   

    div.appendChild(areUsureText)
    div.appendChild(yes)   
    div.appendChild(no)   
    tr.appendChild(div)


  
   
    addClassList(yes,'button yes all')
    addClassList(no,'button no all')
    addClassList(areUsureText,'areUsureText')
 
    innerHTML(areUsureText,'Do u want remove all marked element?') 
    innerHTML(yes,'YES') 
    innerHTML(no,'NO') 
    no.onclick=createButtonForAllChecked
    yes.onclick=removeCheckedElements
}

function removeCheckedElements(){

    table.removeChild(table.lastChild)
    const arr=[]

    for(element of checkbox){
        
       
        if (element.checked===true){

            const tr=element.parentNode.parentNode.parentNode
            arr.push(tr)   
            numOfChecked--    
        }
    }
    arr.forEach(element=>table.removeChild(element))
    
    buttonDeleteAllExsist=0  
}

function removeDivWithNoResultText(){

    if (tableAndPagination.contains(divWithNoResultText[0])){
        
        tableAndPagination.removeChild(divWithNoResultText[0])

    }  
}















// function createOrRemoveDeletingButtonForChecked(){

  
//     if (numOfChecked<0){
//         // buttonDeleteExsist=1
//         const buttonDeleteCheckedElements=createElement('button')
//         const trashBoxIcon=createElement('icon')
//         addClassList(trashBoxIcon,'icon-trash')
//         addClassList(buttonDeleteCheckedElements,'buttonDelete all')
//         buttonDeleteCheckedElements.appendChild(trashBoxIcon)
//         paginationDiv[0].appendChild(buttonDeleteCheckedElements)
       
//     }

  

  
   
// }




// async function fetchSpecificPage(pageNumber){
  
//     const response=await fetch(`${BASE_URL}${buttonName}/?page=${pageNumber}`)
//     const data=await response.json()
//     collection=data
// }



  // if (numberOfPages%2===0){
        //         console.log('parzysta liczba stron')
        //     //  fetchSpecificPage(numberOfPages*2-1)
        // }  
        //     else console.log('nieparzysta')
        //     innerHTML(spanBetweenPagination[0],`${pageNumber} from ${numberOfPages}`)
        //     removeTable()
        //     await fetchSpecificPage(numberOfPages*2-1)
        //     createInstances()
        // }
    // else if(pageNumber%2===0){
        // innerHTML(spanBetweenPagination[0],`${pageNumber} from ${numberOfPages}`)

        //dziala//
    
    // else
        
      // clearTable()
        // removePagination()
        // clearResultsAndSearchDiv() 
    // else iuf {
           
    //         innerHTML(spanBetweenPagination[0],`${pageNumber} from ${numberOfPages}`)
    //         await fetchSpecificPage(pageNumber)
    //         removeTable()
    //         // console.log(button)
    //         createInstances(buttonName)
    //      }
    //  } 
    //  else {
    //     innerHTML(spanBetweenPagination[0],`${pageNumber} from ${numberOfPages}`)
    //  }
    // }
    //         
//         // if 
//         console.log(numberOfPages,'page number klikajac na 20')
//         if (pageNumber===1){
//             await fetch20Data() 
//             removeTable()
//             createInstances(buttonName)
//         }
//         else if (pageNumber===2){
//              console.log(pageNumber,'dwa')
            
//             await fetch20Data()
//             pageNumber--
//             removeTable()
//             createInstances(buttonName)
//             console.log(collectionArr,'page rownal sie 2 ')
//             // console.log(pageNumber)

//         }
//         else if  (pageNumber%2===0){
//             pageNumber=pageNumber/2
//             fetch20Data()
//             console.log('nie 2 i podzielne przez 2',pageNumber)
//         }
       
//         else  if (!pageNumber%2===0){
          
//                 pageNumber-=1
//                 fetch20Data()
//                 console.log(pageNumber,'rozne od 2')
//                 }
            
     
              
           // console.log(index)
//     }
    
//     else if  (pageSizeValue==='10'){
        
//             console.log('pageNumberasdasdasdasd',pageNumber)
//             console.log(numberOfPages)
//                 if (pageNumber==1){
//                     pageNumber=1
//                     console.log('pagenuber',pageNumber)
//                     numberOfPages= countNumberOfPages(pageSizeValue)
//                     collectionArr= await fetchSpecificPage(pageNumber)
                     
//                     removeTable()
//                     createInstances(buttonName)

//                     innerHTML(spanBetweenPagination[0],`${pageNumber} from ${numberOfPages}`) 
//                 }
//                 else if (pageNumber%2===0){
//                     pageNumber++
//                     collectionArr= await fetchSpecificPage(pageNumber)
//                     removeTable()
//                     console.log('collection ARr',collectionArr)
//                     console.log(pageNumber)
//                     createInstances(buttonName)
//                     console.log(instances,'instancja')

//                 }
//                 else if (pageNumber==numberOfPages){
//                     console.log('pagenumber',pageNumber)
//                     // if(pageNumber===pageSizeValue){
//                         console.log('jest nieparzyste')
//                         numberOfPages= countNumberOfPages(pageSizeValue)  
//                     // }
                  

//                 }
//                 // // pageNumber+=1
//                 // console.log('pageNumber po zmiana',pageNumber)
//                 // fetchSpecificPage(pageNumber)
           
            
//             // removeTable()
//             // createInstances(buttonName)
//         }
     
    
   // const div=createElement('div')
    // const buttonDeleteCheckedElements=createElement('button')
    // const trashBoxIcon=createElement('icon')
    
    // addClassList(trashBoxIcon,'icon-trash')
    // addClassList(buttonDeleteCheckedElements,'buttonDelete all')

    // buttonDeleteCheckedElements.appendChild(trashBoxIcon)
    // div.appendChild(buttonDeleteCheckedElements)
    // paginationDiv[0].appendChild(div)
    
//     innerHTML(spanBetweenPagination[0],`${pageNumber} from ${numberOfPages}`) 
// }
 // if (pageNumber==1){
    //     console.log('ktoruy ')
    // const response1=await fetch(`${BASE_URL}${buttonName}/?page=${pageNumber}`)
    // const data1=await response1.json()
    // const response2=await fetch(`${BASE_URL}${buttonName}/?page=${pageNumber+1}`)
    // const data2=await response2.json()
    // collectionArr=[...data1.results,...data2.results]
    // console.log('collection ')
    // }
    // else 

       // }

        
   
  // console.log(trDeleteAllChecked[0].removeChild(trDeleteAllChecked[0].lastChild))
    //    if (trDeleteAllChecked[0]){
    //     console.log(trDeleteAllChecked[0])

    //     // trDeleteAllChecked[0].removeChild( buttonDeleteCheckedElements[0]) 
    //     // console.log('nooo')
    //     }
        // table.removeChild
    // const collection 
    // console.log( collection.results.concat(data.results))
    // console.log(collectionArr,'collectionArr')
    
    // removeTable()
    // createInstances(buttonName)

//     const nextPageDataArr=data.results
//     const thisPageDataArr=collection.results

//   console.log(thisPageDataArr,nextPageDataArr)
//     thisPageDataArr
//     collection=[thisPageDataArr,]
//     else if (pageSizeValue==20){
//     //   console.log('pageNumber',pageNumber)
//     // if (pageNumber%2===0){
//     //     pageNumber-=1
//     //     console.log('spelnilo sie' )
//     // }    
//         if (pageNumber===numberOfPages){
//             console.log('wykonal sie ttuu')
//             const response2=await fetch(`${BASE_URL}${buttonName}/?page=${(pageNumber*2)-1}`)
//             const data2=await response2.json()
//             collectionArr=data2.results
//         }
//         else  {
//             console.log(pageNumber)
//             const response1=await fetch(`${BASE_URL}${buttonName}/?page=${pageNumber+1}`)
//             const data1=await response1.json()
//             const response2=await fetch(`${BASE_URL}${buttonName}/?page=${pageNumber+2}`)
//             const data2=await response2.json()
//             collectionArr=[...data1.results,...data2.results]
//             // console.log('data przy 20',data)
//             // console.log('collection przy 20',collectionArr)
            
//             collectionArr=[...data1.results,...data2.results]

//         }  
         
           
//         }
         // else if (this.value==1){
        //     pageNumber=this.value
        //     console.log('this.value==1',1)
        //     await createNewTableWithNewData(pageNumber*2-1,pageNumber*2)
        // }
//   }
    // const response=await fetch(`${BASE_URL}${buttonName}/?page=${pageNumber}`)
    // const data=await response.json()
    // collection=data
  // else if (!pageNumber%2===0){
        //     console.log(pageNumber,'rozny')
        //     pageNumber--
        //     await fetch20DataForChangeAt20(pageNumber*2-1,pageNumber*2)
          
        //     changeSpanBetweenNextAndPrevButton()
        //     removeTable()
        //     createInstances(buttonName)

        // }

          // console.log(rowId,'rowId')
    // const id=rowId[rowId.length-1]
    // if (pageSizeValue==10){
        
    //     console.log(id,'id')
    // }
    
    // console.log(id)
      // const rowIdNumber=(target.firstChild.textContent)-1
    // const rowIdString=rowIdNumber.toString()

    // if (pageSizeValue==10){
    //     if (pageNumber>1){

    //         id=rowIdString[rowIdString.length-1]
    //     }

    //     else id=rowIdNumber   
    // }

    // if(pageSizeValue==20){
        
    //     if (pageNumber>1){

    //         const dif= pageNumber-1
    //         idAfterRefactor= dif*20
    //         id=rowIdNumber-idAfterRefactor   
    //     }

    //     else id=rowIdNumber
    // }
        

  

    // pageNumber=this.value
  
    // if (pageSizeValue==10){
    //     await fetchSpecificPage(pageNumber)
    //     createNewTableWithNewData()
    // }
    

    // else  {
    //     if (pageNumber>=numberOfPages){
    //         if (!pageNumber%2===0){
    //             fetchSpecificPage(pageNumber*2-1)
    //         }
    //         else{
    //             createNewTableWithNewData(pageNumber*2-1,pageNumber*2)
    //         }
    //     }

    //     if (pageNumber%2===0){
    //         createNewTableWithNewData(pageNumber*2-1,pageNumber*2)
    //     }


    // }
    // if (pageSizeValue==20){
       
    //     console.log('pejdz jest rowny dwadziescia')
    //     if(pageNumber<=1){
    //         pageNumber=1 
    //         console.log('tutut')
    //         fetchSpecificPage(pageNumber)
    //         removeTable()
    //         createInstances(buttonName)
           
    //     }
        
    // }
    // removeTable()
    // createInstances(buttonName)
//     const indexFromInput=(target.firstChild.value)
    //     if (indexFromInput===''){
    //         console.log('wprowadz wartosc')
    //         target.firstChild.style.border='3px solid var(--red)'
    //         return
    //     }
    //     // const index=+indexFromInput
    //     // console.log(index)
       
    //     const data=await fetchSpecifyIndex(indexFromInput)
    //    if (data===undefined ){
    //     await fetchSpecificPage(indexFromInput+1)
    //    }
    //     createInstances(buttonName)
    //    
    //     return

     // const buttonDeleteCheckedElements=createElement('button')
        // const trashBoxIcon=createElement('icon')
        // addClassList(trashBoxIcon,'icon-trash')
        // addClassList(buttonDeleteCheckedElements,'buttonDelete all')
        // buttonDeleteCheckedElements.appendChild(trashBoxIcon)
        // paginationDiv[0].appendChild(buttonDeleteCheckedElements)

        // // buttonDeleteCheckedElements.onclick= removeCheckedElements
        // buttonDeleteCheckedElements.onclick=createYesOrNoButtonForAllChecked
            // if (paginationDiv[0].lastChild.tagName==='div'){
        //     console.log(paginationDiv[0].lastChild)
        // }