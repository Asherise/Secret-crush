/* =====================================================
MODULE: APPLICATION STARTUP
===================================================== */
document.addEventListener("DOMContentLoaded",startSecretCrushApp);

/* =====================================================
   MODULE: ASHERISE MESSAGE SYSTEM
   ===================================================== */

/*
 * CENTRAL SECRET CRUSH MESSAGE ENGINE
 *
 * All system messages use this engine.
 *
 * Existing alert() calls are intercepted below so
 * older parts of the app automatically use the new
 * Secret Crush message system.
 */


/* =====================================================
   ELEMENT REFERENCES
   ===================================================== */

const scMessageOverlay =
    document.getElementById(
        "sc-message-overlay"
    );

const scMessageBackdrop =
    document.getElementById(
        "sc-message-backdrop"
    );

const scMessageCard =
    document.getElementById(
        "sc-message-card"
    );

const scMessageIcon =
    document.getElementById(
        "sc-message-icon"
    );

const scMessageEyebrow =
    document.getElementById(
        "sc-message-eyebrow"
    );

const scMessageTitle =
    document.getElementById(
        "sc-message-title"
    );

const scMessageBody =
    document.getElementById(
        "sc-message-body"
    );

const scMessageActions =
    document.getElementById(
        "sc-message-actions"
    );

const scMessagePrimary =
    document.getElementById(
        "sc-message-primary"
    );


let scMessageCloseTimer=null;


/* =====================================================
   MESSAGE CATEGORY DEFINITIONS
   ===================================================== */

const SC_MESSAGE_TYPES={

    information:{
        eyebrow:"INFORMATION",
        icon:"✦",
        className:"sc-message-information"
    },

    success:{
        eyebrow:"SUCCESS",
        icon:"♡",
        className:"sc-message-success"
    },

    warning:{
        eyebrow:"PLEASE NOTE",
        icon:"!",
        className:"sc-message-warning"
    },

    error:{
        eyebrow:"SOMETHING WENT WRONG",
        icon:"×",
        className:"sc-message-error"
    },

    coins:{
        eyebrow:"SECRET CRUSH COINS",
        icon:"◈",
        className:"sc-message-coins"
    },

    important:{
        eyebrow:"IMPORTANT",
        icon:"✉",
        className:"sc-message-important"
    },

    reveal:{
        eyebrow:"REVEAL",
        icon:"◇",
        className:"sc-message-reveal"
    },

    gift:{
        eyebrow:"GIFTS",
        icon:"♢",
        className:"sc-message-gift"
    },

    processing:{
        eyebrow:"PROCESSING",
        icon:"⋯",
        className:"sc-message-processing"
    },

    destructive:{
        eyebrow:"ACTION REQUIRED",
        icon:"!",
        className:"sc-message-destructive"
    }

};


/* =====================================================
   APPLY MESSAGE CATEGORY
   ===================================================== */

function applySCMessageType(
    type="information"
){

    const definition =
        SC_MESSAGE_TYPES[type] ||
        SC_MESSAGE_TYPES.information;


    /*
     * Remove every previous category.
     */

    Object.values(
        SC_MESSAGE_TYPES
    ).forEach(
        item=>{

            scMessageCard?.classList.remove(
                item.className
            );

        }
    );


    /*
     * Apply the new category.
     */

    scMessageCard?.classList.add(
        definition.className
    );


    return definition;

}


/* =====================================================
   SHOW MESSAGE
   ===================================================== */

function showSCMessage({

    type="information",

    title="Notice",

    message="",

    eyebrow=null,

    icon=null,

    buttonText="Okay",

    onClose=null

}={}){

    if(!scMessageOverlay){
        return;
    }


    const definition =
        applySCMessageType(type);


    /*
     * Clear previous timer.
     */

    if(scMessageCloseTimer){

        clearTimeout(
            scMessageCloseTimer
        );

        scMessageCloseTimer=null;

    }


    /*
     * Populate the reusable overlay.
     */

    scMessageIcon.textContent =
        icon || definition.icon;


    scMessageEyebrow.textContent =
        eyebrow || definition.eyebrow;


    scMessageTitle.textContent =
        title;


    scMessageBody.textContent =
        message;


    scMessagePrimary.textContent =
        buttonText;


    /*
     * Remove previous action.
     */

    scMessagePrimary.onclick=null;


    /*
     * Current button action.
     */

    scMessagePrimary.onclick=()=>{

        closeSCMessage();


        if(typeof onClose==="function"){

            onClose();

        }

    };


    /*
     * Open.
     */

    scMessageOverlay.classList.add(
        "active"
    );


    scMessageOverlay.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "sc-message-open"
    );

}


/* =====================================================
   CLOSE MESSAGE
   ===================================================== */

function closeSCMessage(){

    if(!scMessageOverlay){
        return;
    }


    scMessageOverlay.classList.remove(
        "active"
    );


    scMessageOverlay.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "sc-message-open"
    );


    if(scMessageCloseTimer){

        clearTimeout(
            scMessageCloseTimer
        );

        scMessageCloseTimer=null;

    }

}


/* =====================================================
   BACKDROP CLOSE
   ===================================================== */

if(scMessageBackdrop){

    scMessageBackdrop.addEventListener(
        "click",
        closeSCMessage
    );

}


/* =====================================================
   ESCAPE KEY
   ===================================================== */

document.addEventListener(
    "keydown",
    event=>{

        if(
            event.key==="Escape" &&
            scMessageOverlay?.classList.contains(
                "active"
            )
        ){

            closeSCMessage();

        }

    }
);


/* =====================================================
   CLASSIFY EXISTING ALERT MESSAGE
   ===================================================== */

function classifySCAlert(message){

    const text =
        String(message || "")
            .toLowerCase();


    /*
     * COINS / ECONOMY
     */

    if(
        text.includes("coins") ||
        text.includes("ksh") ||
        text.includes("coin")
    ){

        return {
            type:"coins"
        };

    }


    /*
     * REVEALS
     */

    if(
        text.includes("revealed") ||
        text.includes("reveal") ||
        text.includes("clue")
    ){

        return {
            type:"reveal"
        };

    }


    /*
     * GIFTS
     */

    if(
        text.includes("gift")
    ){

        return {
            type:"gift"
        };

    }


    /*
     * DESTRUCTIVE / UNDOABLE ACTIONS
     */

    if(
        text.includes("cannot be undone") ||
        text.includes("already been opened") ||
        text.includes("can no longer be") ||
        text.includes("cannot be edited") ||
        text.includes("cannot be unsent")
    ){

        return {
            type:"destructive"
        };

    }


    /*
     * ERRORS
     */

    if(
        text.includes("error") ||
        text.includes("problem") ||
        text.includes("could not") ||
        text.includes("couldn't") ||
        text.includes("failed") ||
        text.includes("went wrong")
    ){

        return {
            type:"error"
        };

    }


    /*
     * SUCCESS
     */

    if(
        text.includes("successfully") ||
        text.includes("has been sent") ||
        text.includes("has been unsent") ||
        text.includes("have been updated") ||
        text.includes("updated.")
    ){

        return {
            type:"success"
        };

    }


    /*
     * IMPORTANT / FUTURE FEATURES
     */

    if(
        text.includes("will be connected") ||
        text.includes("will become available") ||
        text.includes("will be available") ||
        text.includes("backend") ||
        text.includes("later")
    ){

        return {
            type:"important"
        };

    }


    /*
     * VALIDATION / WARNING
     */

    if(
        text.includes("please") ||
        text.includes("cannot") ||
        text.includes("can't") ||
        text.includes("already")
    ){

        return {
            type:"warning"
        };

    }


    /*
     * DEFAULT
     */

    return {
        type:"information"
    };

}


/* =====================================================
   CREATE USER-FRIENDLY TITLE
   ===================================================== */

function getSCAlertTitle(
    message,
    type
){

    const text =
        String(message || "")
            .toLowerCase();


    if(text.includes("complete your profile")){
        return "Complete Your Profile";
    }


    if(
        text.includes("select exactly 5 interests") ||
        text.includes("5 interests")
    ){

        return "Choose Your Interests";

    }


    if(
        text.includes("select an image") ||
        text.includes("choose an image")
    ){

        return "Invalid Image";

    }


    if(
        text.includes("profile could not be found")
    ){

        return "Profile Not Found";

    }


    if(
        text.includes("profile updated")
    ){

        return "Profile Updated";

    }


    if(
        text.includes("interests have been updated")
    ){

        return "Interests Updated";

    }


    if(
        text.includes("has been sent")
    ){

        return "Sent";

    }


    if(
        text.includes("has been unsent")
    ){

        return "Unsent";

    }


    if(
        text.includes("already been opened")
    ){

        return "Already Opened";

    }


    if(
        text.includes("already been used")
    ){

        return "No More Clues";

    }


    if(
        text.includes("cannot be edited")
    ){

        return "Cannot Edit";

    }


    if(
        text.includes("cannot be unsent")
    ){

        return "Cannot Unsend";

    }


    if(
        text.includes("cannot be empty")
    ){

        return "Empty Message";

    }


    if(
        text.includes("delete")
    ){

        return "Action Notice";

    }


    if(type==="coins"){
        return "Coin Balance";
    }


    if(type==="reveal"){
        return "Reveal Update";
    }


    if(type==="gift"){
        return "Gift Update";
    }


    if(type==="important"){
        return "Coming Soon";
    }


    if(type==="error"){
        return "Something Went Wrong";
    }


    if(type==="warning"){
        return "Please Check";
    }


    if(type==="success"){
        return "Success";
    }


    return "Notice";

}


/* =====================================================
   INTERCEPT EXISTING ALERT()
   ===================================================== */

window.alert=function(message){

    const classification =
        classifySCAlert(message);


    const type =
        classification.type;


    showSCMessage({

        type:type,

        title:
            getSCAlertTitle(
                message,
                type
            ),

        message:String(
            message || ""
        ),

        buttonText:
            type==="coins"
                ? "Okay"
                : "Got It"

    });

};

/* =====================================================
MODULE: ELEMENT REFERENCES
===================================================== */
const asheriseSplash=document.getElementById("asherise-splash");
const cupidIntro=document.getElementById("cupid-intro");
const heartContainer=document.querySelector(".heart-container");
const cupidArrow=document.querySelector(".cupid-arrow");
const secretCrushLogo=document.querySelector(".secret-crush-logo");
const introLineOne=document.getElementById("intro-line-one");
const introLineTwo=document.getElementById("intro-line-two");
const registrationPage=document.getElementById("registration-page-1");
const registrationNext=document.getElementById("registration-next");
const profilePictureInput=document.getElementById("profile-picture");
const profilePreview=document.getElementById("profile-preview");
const profilePlus=document.getElementById("profile-plus");
const registrationPage2=document.getElementById("registration-page-2");
const registrationPage3=document.getElementById("registration-page-3");
const homepage=document.getElementById("homepage");
const feedPage=document.getElementById("feed-page");
const createProfileButton=document.getElementById("create-profile-button");
const genderCards=document.querySelectorAll(".gender-card");
const genderNext=document.getElementById("gender-next");
const interestOptions=document.querySelectorAll(".interest-option");
const interestCount=document.getElementById("interest-count");
const homeSearch=document.getElementById("home-search-input");
const bankPage = document.getElementById("bank-page");
const chatsPage =
    document.getElementById("chats-page");

/* =====================================================
MODULE: HOME — SIDE MENU REFERENCES
===================================================== */

const menuButton =
    document.getElementById("menu-button");

const sideMenu =
    document.getElementById("side-menu");

const streaksPage =
    document.getElementById("streaks-page");

const gameHistoryPage =
    document.getElementById("game-history-page");

const gameHistoryBackButton =
    document.getElementById("game-history-back-button");

const gameHistoryDetailBack =
    document.getElementById("game-history-detail-back");

const gameHistoryList =
    document.getElementById("game-history-list");

const gameHistoryDetail =
    document.getElementById("game-history-detail");

const gameHistoryDetailCard =
    document.getElementById("game-history-detail-card");

const gameHistoryTabs =
    document.querySelectorAll(".game-history-tab");
const sideMenuBackdrop =
    document.getElementById("side-menu-backdrop");

const sideMenuClose =
    document.getElementById("side-menu-close");

const sideMenuItems =
    document.querySelectorAll(".side-menu-item");
    /* =====================================================
MODULE: HELP & SUPPORT REFERENCES
===================================================== */

const helpSupportPage =
    document.getElementById(
        "help-support-page"
    );

const helpSupportBackButton =
    document.getElementById(
        "help-support-back-button"
    );

const helpSupportSearchInput =
    document.getElementById(
        "help-support-search-input"
    );

const helpFaqList =
    document.getElementById(
        "help-faq-list"
    );

const helpTopicOverlay =
    document.getElementById(
        "help-topic-overlay"
    );

const helpTopicBackdrop =
    document.getElementById(
        "help-topic-backdrop"
    );

const helpTopicClose =
    document.getElementById(
        "help-topic-close"
    );

const helpTopicTitle =
    document.getElementById(
        "help-topic-title"
    );

const helpTopicDescription =
    document.getElementById(
        "help-topic-description"
    );

const helpTopicDialogIcon =
    document.getElementById(
        "help-topic-dialog-icon"
    );

const helpTopicFaqs =
    document.getElementById(
        "help-topic-faqs"
    );

const helpActionOverlay =
    document.getElementById(
        "help-action-overlay"
    );

const helpActionBackdrop =
    document.getElementById(
        "help-action-backdrop"
    );

const helpActionClose =
    document.getElementById(
        "help-action-close"
    );

const helpActionTitle =
    document.getElementById(
        "help-action-title"
    );

const helpActionDescription =
    document.getElementById(
        "help-action-description"
    );

const helpActionIconLarge =
    document.getElementById(
        "help-action-icon-large"
    );

const helpActionContent =
    document.getElementById(
        "help-action-content"
    );
    /* =====================================================
MODULE: SPADE — ACTIVITY HUB REFERENCES
===================================================== */

const activityHub =
    document.getElementById("activity-hub");

const activityHubBackdrop =
    document.getElementById("activity-hub-backdrop");

const activityHubClose =
    document.getElementById("activity-hub-close");

const activityHubButton =
    document.getElementById("notification-button");

const activityCards =
    document.querySelectorAll(".activity-card");
    
    const otherActivityPage =
    document.getElementById("other-activity-page");


const otherActivityBackdrop =
    document.getElementById("other-activity-backdrop");


const otherActivityBack =
    document.getElementById("other-activity-back");


const otherActivityList =
    document.getElementById("other-activity-list");


const otherActivityEmpty =
    document.getElementById("other-activity-empty");


const otherActivityThread =
    document.getElementById("other-activity-thread");


const otherActivityThreadBackdrop =
    document.getElementById(
        "other-activity-thread-backdrop"
    );


const otherActivityThreadList =
    document.getElementById(
        "other-activity-thread-list"
    );


const otherActivityThreadHeader =
    document.getElementById(
        "other-activity-thread-header"
    );


const otherActivityBadge =
    document.getElementById(
        "other-activity-badge"
    );


const OTHER_ACTIVITY_STORAGE_KEY =
    "secretCrushOtherActivity";


let activeOtherActivityPersonId =
    null;
    
    


let selectedGender="";
let selectedInterests=[];
let selectedProfilePicture="";

/* =====================================================
/* =====================================================
MODULE: MASTER STARTUP
===================================================== */
function startSecretCrushApp(){
    hideAppNavigation();

    if(!asheriseSplash||!cupidIntro)return;

    setTimeout(transitionToCupid,2200);
    
}

/* =====================================================
MODULE: ASHERISE → CUPID TRANSITION
===================================================== */
function transitionToCupid(){
    asheriseSplash.classList.add("exit");

    setTimeout(()=>{
        asheriseSplash.classList.remove("active");
        cupidIntro.classList.add("active");
        startCupidSequence();
    },500);
    
}

/* =====================================================
MODULE: CUPID INTRO SEQUENCE
===================================================== */
function startCupidSequence(){
    setTimeout(()=>{
        heartContainer.classList.add("heart-visible");
    },300);

    setTimeout(()=>{
        cupidArrow.classList.add("arrow-fire");
    },1500);

    setTimeout(()=>{
        heartContainer.classList.add("cupid-impact");
    },2150);

    setTimeout(()=>{
        secretCrushLogo.classList.add("logo-reveal");
    },2550);

    setTimeout(()=>{
        introLineOne.classList.add("show-line-one");
    },3700);

    setTimeout(()=>{
        introLineTwo.classList.add("show-line-two");
    },5100);

    setTimeout(continueAfterIntro,7000);
}

/* =====================================================
MODULE: INTRO → SESSION ROUTING
===================================================== */
function continueAfterIntro(){

    cupidIntro.classList.remove("active");

    const savedSession=localStorage.getItem("secretCrushSession");
    const savedProfile=localStorage.getItem("secretCrushProfile");

    if(savedSession && savedProfile){

        openHomepage();

    }else{

        hideAppNavigation();

        registrationPage.classList.add("active");

    }
}
/* =====================================================
MODULE: REGISTRATION — PAGE 1 VALIDATION
===================================================== */
registrationNext.addEventListener("click",()=>{
    const profileName=document.getElementById("profile-name").value.trim();
    const institution=document.getElementById("institution").value;
    const faculty=document.getElementById("faculty").value;
    const studyYear=document.getElementById("study-year").value;

    if(!profileName||!institution||!faculty||!studyYear){

    showSCMessage({

        type:"INFORMATION",

        icon:"✦",

        title:"Complete Your Profile",

        message:
            "Please complete all the required profile details before continuing.",

        buttonText:"Got It"

    });

    return;
}

    registrationPage.classList.remove("active");
    registrationPage2.classList.add("active");
    hideAppNavigation();
});

/* =====================================================
MODULE: PROFILE PICTURE UPLOAD
===================================================== */
profilePictureInput.addEventListener("change",()=>{
    const file=profilePictureInput.files[0];

    if(!file)return;

if(!file.type.startsWith("image/")){

    showSCMessage({

        type:"INFORMATION",

        icon:"✦",

        title:"Invalid Profile Picture",

        message:
            "Please choose an image file to use as your profile picture.",

        buttonText:"Got It"

    });

    profilePictureInput.value="";

    return;
}

    const reader=new FileReader();

    reader.onload=event=>{
        selectedProfilePicture=event.target.result;
        profilePreview.src=selectedProfilePicture;
        profilePreview.style.display="block";
        profilePlus.style.display="none";
    };

    reader.readAsDataURL(file);
});

/* =====================================================
MODULE: REGISTRATION — PAGE 2 GENDER
===================================================== */
genderNext.disabled=true;

genderCards.forEach(card=>{
    card.addEventListener("click",()=>{
        genderCards.forEach(item=>{
            item.classList.remove("selected");
        });

        card.classList.add("selected");
        selectedGender=card.dataset.gender;
        genderNext.disabled=false;
    });
});

genderNext.addEventListener("click",()=>{
    if(!selectedGender)return;

    registrationPage2.classList.remove("active");
    registrationPage3.classList.add("active");
});

/* =====================================================
MODULE: REGISTRATION — PAGE 3 INTERESTS
===================================================== */
createProfileButton.disabled=true;

interestOptions.forEach(option=>{
    option.addEventListener("click",()=>{
        const interest=option.dataset.interest;

        if(option.classList.contains("selected")){
            option.classList.remove("selected");

            selectedInterests=selectedInterests.filter(item=>{
                return item!==interest;
            });
        }else{
            if(selectedInterests.length>=5)return;

            option.classList.add("selected");
            selectedInterests.push(interest);
        }

        interestCount.textContent=selectedInterests.length;
        createProfileButton.disabled=selectedInterests.length!==5;
    });
});

/* =====================================================
MODULE: SESSION TOKEN
===================================================== */
function createSessionToken(){
    if(window.crypto&&crypto.randomUUID){
        return crypto.randomUUID();
    }

    return "sc-"+Date.now()+"-"+Math.random().toString(36).slice(2);
}

/* =====================================================
MODULE: REGISTRATION — PROFILE CREATION
===================================================== */
createProfileButton.addEventListener("click",()=>{
    if(selectedInterests.length!==5){
        alert("Please select exactly 5 interests.");
        return;
    }
const profileData={

    userId:
        "user-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2,8),

    name:
        document
            .getElementById(
                "profile-name"
            )
            .value
            .trim(),
            
        institution:document.getElementById("institution").value,
        faculty:document.getElementById("faculty").value,
        year:document.getElementById("study-year").value,
        gender:selectedGender,
        interests:[...selectedInterests],
        profilePicture:selectedProfilePicture,
        coins:0,
        about:"",
        crushesReceived:0,
        secretNotesReceived:0,
        createdAt:new Date().toISOString()
    };

    localStorage.setItem(
        "secretCrushProfile",
        JSON.stringify(profileData)
    );

    localStorage.setItem(
        "secretCrushSession",
        createSessionToken()
    );

    openHomepage();
    showAppNavigation();
});

/* =====================================================
MODULE: HOMEPAGE — INITIALIZATION
===================================================== */
function openHomepage(){
    document.querySelectorAll(".screen").forEach(screen=>{
        screen.classList.remove("active");
    });

    document.querySelectorAll(".app-page").forEach(page=>{
        page.classList.remove("active");
    });

    homepage.classList.add("active");
    setActiveNavigation("home");
    loadHomepageProfile();
    loadSavedMoments();
    updateMomentProfileAbout();
    showAppNavigation();

}

/* =====================================================
MODULE: HOMEPAGE — LOAD USER DATA
===================================================== */
function loadHomepageProfile(){
    const savedProfile=localStorage.getItem("secretCrushProfile");

    if(!savedProfile)return;

    let profile;

    try{
        profile=JSON.parse(savedProfile);
    }catch(error){
        localStorage.removeItem("secretCrushProfile");
        localStorage.removeItem("secretCrushSession");
        return;
    }

    const profilePicture=document.getElementById("home-profile-picture");
    const schoolFilter=document.getElementById("my-school-filter");
    const feedSchool=document.getElementById("feed-school-name");
    const momentInstitution=document.getElementById("moment-institution");
    const coinCount=document.getElementById("coin-count");

    if(profile.profilePicture&&profilePicture){
        profilePicture.src=profile.profilePicture;
    }

    if(profile.institution){

    /*
     * Homepage institution placeholder
     * is controlled by the saved filter state.
     */

    if(schoolFilter){

        const savedSchools =
            SC_activeFilters.home.school || [];


        if(savedSchools.length === 1){

            schoolFilter.textContent =
                savedSchools[0];

        }else{

            schoolFilter.textContent =
                profile.institution;

        }

    }


    /*
     * Feed primary institution pill
     * must respect Only / Plus mode.
     */

    if(feedSchool){

        if(
            typeof SC_Filters_UpdatePrimarySchoolLabel ===
            "function"
        ){

            SC_Filters_UpdatePrimarySchoolLabel();

        }else{

            feedSchool.textContent =
                profile.institution;

        }

    }


    if(momentInstitution){

        momentInstitution.textContent =
            profile.institution;

    }

}



if(coinCount){

    coinCount.textContent =
        getBankCoinBalance()
            .toLocaleString();

}
}

/* =====================================================
MODULE: FILTER DROPDOWNS (Home + Feed)
===================================================== */
/* =====================================================
MODULE: SEARCH FILTER SYSTEM
===================================================== */

const SC_FILTER_STORAGE_KEY = "secretCrushSearchFilters";
const SC_PRIMARY_SCHOOL_STORAGE_KEY = "secretCrushPrimarySchoolMode";

const SC_FILTER_OPTIONS = {

    school: [
        "Africa International University",
        "Africa Nazarene University",
        "Aga Khan University",
        "Alupe University",
        "Amref International University",
        "Catholic University of Eastern Africa",
        "Chuka University",
        "Co-operative University of Kenya",
        "Daystar University",
        "Dedan Kimathi University of Technology",
        "Egerton University",
        "Garissa University",
        "Great Lakes University of Kisumu",
        "Gretsa University",
        "Jaramogi Oginga Odinga University of Science and Technology",
        "Jomo Kenyatta University of Agriculture and Technology",
        "Kabarak University",
        "KAG East University",
        "Kaimosi Friends University",
        "Karatina University",
        "KCA University",
        "Kenyatta University",
        "Kenya Methodist University",
        "Kirinyaga University",
        "Kisii University",
        "Laikipia University",
        "Lukenya University",
        "Machakos University",
        "Maseno University",
        "Masinde Muliro University of Science and Technology",
        "Meru University of Science and Technology",
        "Moi University",
        "Mount Kenya University",
        "Multimedia University of Kenya",
        "Murang'a University of Technology",
        "Open University of Kenya",
        "Pan Africa Christian University",
        "Presbyterian University of East Africa",
        "Pwani University",
        "Riara University",
        "Rongo University",
        "Scott Christian University",
        "South Eastern Kenya University",
        "St. Paul's University",
        "Strathmore University",
        "Taita Taveta University",
        "Technical University of Kenya",
        "Technical University of Mombasa",
        "The East African University",
        "Tharaka University",
        "Tom Mboya University",
        "United States International University-Africa",
        "University of Eldoret",
        "University of Embu",
        "University of Kabianga",
        "University of Nairobi",
        "Uzima University",
        "Zetech University"
    ],

    faculty: [
        "Accounting",
        "Administration",
        "Agriculture",
        "Architecture & Design",
        "Business",
        "Computing & IT",
        "Communication & Media",
        "Development Studies",
        "Economics",
        "Education",
        "Engineering",
        "Environmental Studies",
        "Film",
        "Finance",
        "Health Sciences",
        "Hospitality & Tourism",
        "Human Resources",
        "Humanities",
        "Journalism",
        "Law",
        "Marketing",
        "Medicine",
        "Nursing",
        "Pharmacy",
        "Political Science",
        "Procurement",
        "Psychology",
        "Public Administration",
        "Real Estate",
        "Science",
        "Social Sciences",
        "Sociology",
        "Quantity Surveying"
    ],

    year: [
        "1st",
        "2nd",
        "3rd",
        "4th",
        "5th",
        "6th",
        "+6"
    ],

    gender: [
        "Male",
        "Female"
    ]

};

const SC_FILTER_HAS_SEARCH = {

    school: true,
    faculty: true,
    year: false,
    gender: false

};

const SC_FILTER_LABELS = {

    school: "Beyond My School",
    faculty: "Faculty",
    year: "Year",
    gender: "Gender"

};

const SC_PRIMARY_SCHOOL_MODES = {

    ONLY: "only",
    PLUS: "plus"

};

const SC_activeFilters = {

    home: {
        school: [],
        faculty: [],
        year: [],
        gender: []
    },

    feed: {
        school: [],
        faculty: [],
        year: [],
        gender: []
    }

};

let SC_primarySchoolMode =
    SC_PRIMARY_SCHOOL_MODES.PLUS;

let SC_filterPanel = null;
let SC_filterDraftScope = null;
let SC_filterDraftType = null;

let SC_filterDraftSelection = [];
let SC_filterTouched = false;
let SC_filterDraftPrimaryMode = null;
let SC_filterPanelMode = "filter";


/* =====================================================
FILTER STORAGE
===================================================== */

function SC_Filters_LoadSavedState(){

    try{

        const saved =
            JSON.parse(
                localStorage.getItem(
                    SC_FILTER_STORAGE_KEY
                ) || "{}"
            );

        ["home","feed"].forEach(scope => {

            Object.keys(SC_activeFilters[scope]).forEach(type => {

                if(
                    saved[scope] &&
                    Array.isArray(saved[scope][type])
                ){

                    SC_activeFilters[scope][type] =
                        saved[scope][type].slice();

                }

            });

});

    }catch(error){

        console.warn(
            "Secret Crush: could not load saved filters.",
            error
        );

    }

    const savedPrimary =
        localStorage.getItem(
            SC_PRIMARY_SCHOOL_STORAGE_KEY
        );

    if(
        savedPrimary === SC_PRIMARY_SCHOOL_MODES.ONLY ||
        savedPrimary === SC_PRIMARY_SCHOOL_MODES.PLUS
    ){

        SC_primarySchoolMode =
            savedPrimary;

    }

}


function SC_Filters_SaveState(){

    try{

        localStorage.setItem(
            SC_FILTER_STORAGE_KEY,
            JSON.stringify(SC_activeFilters)
        );

        localStorage.setItem(
            SC_PRIMARY_SCHOOL_STORAGE_KEY,
            SC_primarySchoolMode
        );

    }catch(error){

        console.warn(
            "Secret Crush: could not save filters.",
            error
        );

    }

}


/* =====================================================
FILTER LABEL LOGIC
===================================================== */

function SC_Filters_GetPillLabel(scope, type){

    const selections =
        SC_activeFilters[scope][type];
        
    const baseLabel =
        SC_FILTER_LABELS[type];

    if(!selections || selections.length === 0){

        return baseLabel;

    }

    if(selections.length === 1){

        return selections[0];

    }

    return baseLabel;

}


/* =====================================================
FILTER PILL LABELS
===================================================== */

function SC_Filters_UpdatePillLabels(){

    /*
     * HOME INSTITUTION
     *
     * Home uses data-filter="institution",
     * but the stored filter category is "school".
     */

    const homeInstitutionPills =
        document.querySelectorAll(
            '[data-filter="institution"]'
        );


    homeInstitutionPills.forEach(pill => {

        const label =
            pill.querySelector(
                ".sc-filter-pill-label"
            );


        if(!label){
            return;
        }


        const selections =
            SC_activeFilters.home.school;


        if(
            selections.length === 1
        ){

            label.textContent =
                selections[0];

        }else{

            const profile =
                JSON.parse(
                    localStorage.getItem(
                        "secretCrushProfile"
                    ) || "{}"
                );


            label.textContent =
                profile.institution ||
                "My School";

        }

    });

    /*
     * FEED — BEYOND MY SCHOOL
     */

    const beyondPills =
        document.querySelectorAll(
            '[data-feed-filter="beyond"]'
        );


    beyondPills.forEach(pill => {

        const label =
            pill.querySelector(
                ".sc-filter-pill-label"
            );


        if(!label){
            return;
        }

const selections =
            SC_activeFilters.feed.school;


        if(
            selections.length === 1
        ){

            label.textContent =
                selections[0];

        }else{

            label.textContent =
                "Beyond My School";

        }

    });


/*
     * HOME — FACULTY
     */

    const homeFacultyPills =
        document.querySelectorAll(
            '[data-filter="faculty"]'
        );


    homeFacultyPills.forEach(pill => {

        const label =
            pill.querySelector(
                ".sc-filter-pill-label"
            );


        if(!label){
            return;
        }


        const selections =
            SC_activeFilters.home.faculty;


        label.textContent =
            selections.length === 1
                ? selections[0]
                : "Faculty";

    });


    /*
     * FEED — FACULTY
     */

    const feedFacultyPills =
        document.querySelectorAll(
            '[data-feed-filter="faculty"]'
        );


    feedFacultyPills.forEach(pill => {

        const label =
            pill.querySelector(
                ".sc-filter-pill-label"
            );


        if(!label){
            return;
        }


        const selections =
            SC_activeFilters.feed.faculty;


        label.textContent =
            selections.length === 1
                ? selections[0]
                : "Faculty";

    });
    
    
/*
     * HOME — YEAR
     */

    const homeYearPills =
        document.querySelectorAll(
            '[data-filter="year"]'
        );


    homeYearPills.forEach(pill => {

        const label =
            pill.querySelector(
                ".sc-filter-pill-label"
            );


        if(!label){
            return;
        }


        const selections =
            SC_activeFilters.home.year;


        label.textContent =
            selections.length === 1
                ? selections[0]
                : "Year";

    });


    /*
     * FEED — YEAR
     */

    const feedYearPills =
        document.querySelectorAll(
            '[data-feed-filter="year"]'
        );


    feedYearPills.forEach(pill => {

        const label =
            pill.querySelector(
                ".sc-filter-pill-label"
            );


        if(!label){
            return;
        }


        const selections =
            SC_activeFilters.feed.year;


        label.textContent =
            selections.length === 1
                ? selections[0]
                : "Year";

    });


    /*
     * HOME — GENDER
     */

    const homeGenderPills =
        document.querySelectorAll(
            '[data-filter="gender"]'
        );


    homeGenderPills.forEach(pill => {

        const label =
            pill.querySelector(
                ".sc-filter-pill-label"
            );


        if(!label){
            return;
        }


        const selections =
            SC_activeFilters.home.gender;


        label.textContent =
            selections.length === 1
                ? selections[0]
                : "Gender";

    });


    /*
     * FEED — GENDER
     */

    const feedGenderPills =
        document.querySelectorAll(
            '[data-feed-filter="gender"]'
        );


    feedGenderPills.forEach(pill => {

        const label =
            pill.querySelector(
                ".sc-filter-pill-label"
            );


        if(!label){
            return;
        }


        const selections =
            SC_activeFilters.feed.gender;


        label.textContent =
            selections.length === 1
                ? selections[0]
                : "Gender";

    });

}


/* =====================================================
BUILD FILTER PANEL
===================================================== */

function SC_Filters_BuildPanel(){

    if(SC_filterPanel){

        return SC_filterPanel;

    }

    const panel =
        document.createElement("div");

    panel.className =
        "sc-filter-panel";

    panel.innerHTML = `

        <div class="sc-filter-panel-head">

            <input
                type="text"
                class="sc-filter-search"
                placeholder="Search"
                autocomplete="off"
            >

            <button
                type="button"
                class="sc-filter-select-button"
            >
                Select
            </button>

        </div>

        <div class="sc-filter-list"></div>

    `;

    document.body.appendChild(panel);

    const search =
        panel.querySelector(
            ".sc-filter-search"
        );

    search.addEventListener(
        "input",
        () => {

            SC_Filters_RenderList();

        }
    );


    panel
        .querySelector(
            ".sc-filter-select-button"
        )
        .addEventListener(
            "click",
            event => {

                event.stopPropagation();

                SC_Filters_Confirm();

            }
        );


    /*
     * IMPORTANT:
     * We only close the panel when the click
     * genuinely happens outside it.
     */

    document.addEventListener(
        "click",
        event => {

            if(
                !SC_filterPanel ||
                !SC_filterPanel.classList.contains("open")
            ){

                return;

            }

            const clickedInsidePanel =
                SC_filterPanel.contains(
                    event.target
                );

            const clickedFilterPill =
                event.target.closest(
                    "[data-filter],[data-feed-filter]"
                );

            if(
                clickedInsidePanel ||
                clickedFilterPill
            ){

                return;

            }

            SC_Filters_Close();

        }
    );


    SC_filterPanel = panel;

    return panel;

}


/* =====================================================
FILTER ROW
===================================================== */

function SC_Filters_RowHTML(
    label,
    checked
){

    return `

        <button
            type="button"
            class="sc-filter-row"
            data-value="${label}"
        >

            <span
                class="sc-filter-radio ${
                    checked ? "checked" : ""
                }"
            >
                ${
                    checked
                        ? '<i class="ti ti-check"></i>'
                        : ""
                }
            </span>

            <span class="sc-filter-row-label">
                ${label}
            </span>

        </button>

    `;

}


/* =====================================================
RENDER FILTER OPTIONS
===================================================== */

function SC_Filters_RenderList(){

    if(!SC_filterPanel){

        return;

    }

    const list =
        SC_filterPanel.querySelector(
            ".sc-filter-list"
        );

    const search =
        SC_filterPanel.querySelector(
            ".sc-filter-search"
        );

if(
    SC_filterPanelMode === "primary-school"
){

    list.innerHTML = `

        ${SC_Filters_RowHTML(
            "Only My Institution",
            SC_filterDraftPrimaryMode ===
                SC_PRIMARY_SCHOOL_MODES.ONLY
        )}

        ${SC_Filters_RowHTML(
            "My Institution +",
            SC_filterDraftPrimaryMode ===
                SC_PRIMARY_SCHOOL_MODES.PLUS
        )}

    `;


    /*
     * PRIMARY SCHOOL OPTIONS
     *
     * This listener must be attached before
     * returning from the primary-school branch.
     */

    list
        .querySelectorAll(
            ".sc-filter-row"
        )
        .forEach(row => {

            row.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    const value =
                        row.dataset.value;


                    if(
                        value ===
                        "Only My Institution"
                    ){

                        SC_filterDraftPrimaryMode =
                            SC_PRIMARY_SCHOOL_MODES.ONLY;

                    }else{

                        SC_filterDraftPrimaryMode =
                            SC_PRIMARY_SCHOOL_MODES.PLUS;

                    }


                    SC_filterTouched =
                        true;


                    SC_Filters_RenderList();

                    SC_Filters_RefreshSelectButton();

                }
            );

        });


    return;
}




    const type =
        SC_filterDraftType;

    const query =
        search.value
            .trim()
            .toLowerCase();


    let options =
        (SC_FILTER_OPTIONS[type] || [])
            .filter(
                item =>
                    item
                        .toLowerCase()
                        .includes(query)
            )
            .slice()
            .sort(
                (a,b) =>
                    a.localeCompare(b)
            );


    let html = "";


    /*
     * "All" is always the first option.
     */

    html +=
        SC_Filters_RowHTML(
            "All",
            SC_filterDraftSelection.length === 0
        );


    options.forEach(option => {

        html +=
            SC_Filters_RowHTML(
                option,
                SC_filterDraftSelection.includes(
                    option
                )
            );

    });


    if(
        options.length ||
        !query
    ){

        list.innerHTML =
            html;

    }else{

        list.innerHTML = `

            <p class="sc-filter-empty">
                No match. Try a different search.
            </p>

        `;

    }


    /*
     * IMPORTANT:
     * Do NOT rebuild the panel here.
     * Only rebuild the list.
     *
     * This keeps the dropdown open while
     * multiple selections are made.
     */

    list
        .querySelectorAll(
            ".sc-filter-row"
        )
        .forEach(row => {

            row.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    const value =
                        row.dataset.value;


                    /*
                     * PRIMARY SCHOOL MENU
                     */

                    if(
                        SC_filterPanelMode ===
                        "primary-school"
                    ){

                        if(
                            value ===
                            "Only My Institution"
                        ){

                            SC_filterDraftPrimaryMode =
                                SC_PRIMARY_SCHOOL_MODES.ONLY;

                        }else{

                            SC_filterDraftPrimaryMode =
                                SC_PRIMARY_SCHOOL_MODES.PLUS;

                        }

                        SC_filterTouched =
                            true;

                        SC_Filters_RenderList();

                        SC_Filters_RefreshSelectButton();

                        return;

                    }


                    /*
                     * NORMAL FILTER MENU
                     */

                    SC_filterTouched =
                        true;


                    if(value === "All"){

                        SC_filterDraftSelection =
                            [];

                    }else{

                        const index =
                            SC_filterDraftSelection
                                .indexOf(value);


                        if(index === -1){

                            SC_filterDraftSelection
                                .push(value);

                        }else{

                            SC_filterDraftSelection
                                .splice(index,1);

                        }

                    }


                    SC_Filters_RenderList();

                    SC_Filters_RefreshSelectButton();

                }
            );

        });

}


/* =====================================================
SELECT BUTTON
===================================================== */

function SC_Filters_RefreshSelectButton(){

    if(!SC_filterPanel){

        return;

    }

    const button =
        SC_filterPanel.querySelector(
            ".sc-filter-select-button"
        );

    button.classList.toggle(
        "visible",
        SC_filterTouched
    );

}


/* =====================================================
OPEN NORMAL FILTER
===================================================== */
function SC_Filters_Open(
    pill,
    scope,
    type
){

    const panel =
        SC_Filters_BuildPanel();

    SC_filterPanelMode =
        "filter";

    SC_filterDraftScope =
        scope;

    SC_filterDraftType =
        type;

    SC_filterDraftSelection =
        SC_activeFilters[scope][type].slice();
        

    SC_filterTouched =
        false;

    SC_filterDraftPrimaryMode =
        null;


    const search =
        panel.querySelector(
            ".sc-filter-search"
        );

    search.value = "";

    search.style.display =
        SC_FILTER_HAS_SEARCH[type]
            ? "block"
            : "none";


    SC_Filters_RenderList();

    SC_Filters_RefreshSelectButton();


    SC_Filters_PositionPanel(
        panel,
        pill
    );


    panel.classList.add("open");

    SC_Filters_ClearOpenPills();

    pill.classList.add(
        "filter-open"
    );

}


/* =====================================================
OPEN PRIMARY SCHOOL MENU
===================================================== */

function SC_Filters_OpenPrimarySchool(
    pill
){

    const panel =
        SC_Filters_BuildPanel();

    SC_filterPanelMode =
        "primary-school";

    SC_filterDraftType =
        null;

    SC_filterDraftSelection =
        [];

    SC_filterTouched =
        false;

    SC_filterDraftPrimaryMode =
        SC_primarySchoolMode;


    const search =
        panel.querySelector(
            ".sc-filter-search"
        );

    search.value = "";

    search.style.display =
        "none";


    SC_Filters_RenderList();

    SC_Filters_RefreshSelectButton();


    SC_Filters_PositionPanel(
        panel,
        pill
    );


    panel.classList.add("open");

    SC_Filters_ClearOpenPills();

    pill.classList.add(
        "filter-open"
    );

}


/* =====================================================
POSITION PANEL
===================================================== */

function SC_Filters_PositionPanel(
    panel,
    pill
){

    const rect =
        pill.getBoundingClientRect();


    panel.style.top =
        (rect.bottom + 8) + "px";


    panel.style.left =
        Math.max(
            12,
            Math.min(
                rect.left,
                window.innerWidth -
                panel.offsetWidth -
                12
            )
        ) + "px";

}


/* =====================================================
CLEAR OPEN STATE
===================================================== */

function SC_Filters_ClearOpenPills(){

    document
        .querySelectorAll(
            "[data-filter],[data-feed-filter]"
        )
        .forEach(item => {

            item.classList.remove(
                "filter-open"
            );

        });

}


/* =====================================================
CLOSE
===================================================== */

function SC_Filters_Close(){

    if(!SC_filterPanel){

        return;

    }

    SC_filterPanel.classList.remove(
        "open"
    );

    SC_Filters_ClearOpenPills();

}


/* =====================================================
PRIMARY SCHOOL MODE LABEL
===================================================== */
function SC_Filters_UpdatePrimarySchoolLabel(){

    const profile =
        JSON.parse(
            localStorage.getItem(
                "secretCrushProfile"
            ) || "{}"
        );


    const institution =
        profile.institution ||
        "My Institution";


    const feedSchool =
        document.getElementById(
            "feed-school-name"
        );


    if(!feedSchool){

        return;

    }


    feedSchool.textContent =
        SC_primarySchoolMode === SC_PRIMARY_SCHOOL_MODES.ONLY
            ? institution
            : `${institution} +`;

}


/* =====================================================
PRIMARY SCHOOL CHANGE
===================================================== */

function SC_Filters_ConfirmPrimarySchool(){

    const previousMode =
        SC_primarySchoolMode;


    SC_primarySchoolMode =
        SC_filterDraftPrimaryMode ||
        previousMode;


    SC_Filters_SaveState();

    SC_Filters_UpdatePrimarySchoolLabel();


    /*
     * If the user chooses ONLY their institution,
     * the broader school filter must be cleared.
     */
if(
        SC_primarySchoolMode ===
        SC_PRIMARY_SCHOOL_MODES.ONLY
    ){

        SC_activeFilters.home.school = [];
        SC_activeFilters.feed.school = [];

        SC_Filters_UpdatePillLabels();

    }


    SC_Filters_Close();

    SC_Filters_Apply("home");

    SC_Filters_Apply("feed");



}


/* =====================================================
NORMAL FILTER CONFIRM
===================================================== */

function SC_Filters_Confirm(){

    if(
        SC_filterPanelMode ===
        "primary-school"
    ){

        SC_Filters_ConfirmPrimarySchool();

        return;

    }

const scope =
        SC_filterDraftScope;

    const type =
        SC_filterDraftType;


    SC_activeFilters[scope][type] =
        SC_filterDraftSelection.slice();


    SC_Filters_SaveState();

    SC_Filters_UpdatePillLabels();

    SC_Filters_Close();

    SC_Filters_Apply(scope);

}


/* =====================================================
PRIMARY SCHOOL WARNING
===================================================== */

function SC_Filters_ShowPrimarySchoolWarning(){

    const profile =
        JSON.parse(
            localStorage.getItem(
                "secretCrushProfile"
            ) || "{}"
        );


    const institution =
        profile.institution ||
        "your institution";


    showSCMessage({

        type: "INFORMATION",

        icon: "✦",

        title: "Institution Filter Locked",

        message:
            `You can't filter your search to other institutions while your primary setting is set to Only ${institution}. Change your primary setting to ${institution} + to explore other institutions.`,

        buttonText: "OK"

    });


    /*
     * Once the user closes the message,
     * open the primary-school menu.
     *
     * showSCMessage's button closes the
     * message, so we use a small delayed
     * action to open the menu.
     */

    setTimeout(() => {

        const pill =
            document.querySelector(
                '[data-feed-filter="school"]'
            );

        if(pill){

            SC_Filters_OpenPrimarySchool(
                pill
            );

        }

    }, 250);

}


/* =====================================================
APPLY FILTERS TO CARDS
===================================================== */
function SC_Filters_Apply(scope){

    const cards =
        scope === "home"
            ? document.querySelectorAll(
                ".recommended-user-card, [data-filter-user-card]"
            )
            : document.querySelectorAll(
                ".feed-card, [data-filter-user-card]"
            );

    const activeForScope =
        SC_activeFilters[scope] || SC_activeFilters.feed;


    /*
     * If cards have not yet been converted
     * into filter-aware cards, don't destroy
     * the current feed.
     */

    if(!cards.length){

        return;

    }


    let visibleCount = 0;


    cards.forEach(card => {

        const school =
            card.dataset.school ||
            card.dataset.institution ||
            "";


        const faculty =
            card.dataset.faculty ||
            "";


        const year =
            card.dataset.year ||
            "";


        const gender =
            card.dataset.gender ||
            "";


const matchesSchool =
            activeForScope.school.length === 0 ||
            activeForScope.school.includes(
                school
            );


        const matchesFaculty =
            activeForScope.faculty.length === 0 ||
            activeForScope.faculty.includes(
                faculty
            );


        const matchesYear =
            activeForScope.year.length === 0 ||
            activeForScope.year.includes(
                year
            );


        const matchesGender =
            activeForScope.gender.length === 0 ||
            activeForScope.gender.includes(
                gender
            );
            

        /*
         * Primary school mode.
         */

        let matchesPrimarySchool =
            true;


        if(
            SC_primarySchoolMode ===
            SC_PRIMARY_SCHOOL_MODES.ONLY
        ){

            const profile =
                JSON.parse(
                    localStorage.getItem(
                        "secretCrushProfile"
                    ) || "{}"
                );


            matchesPrimarySchool =
                !school ||
                school ===
                profile.institution;

        }


        const visible =
            matchesSchool &&
            matchesFaculty &&
            matchesYear &&
            matchesGender &&
            matchesPrimarySchool;


        card.style.display =
            visible
                ? ""
                : "none";


        if(visible){

            visibleCount++;

        }

    });


SC_Filters_UpdateNoResultsMessage(
        scope,
        cards,
        visibleCount
    );


}


/* =====================================================
NO RESULTS MESSAGE
===================================================== */

function SC_Filters_UpdateNoResultsMessage(
    scope,
    cards,
    visibleCount
){

    if(scope !== "feed"){

        return;

    }

    const container =
        document.querySelector(
            ".feed-content"
        );


    if(!container){

        return;

    }


    let message =
        document.getElementById(
            "sc-filter-no-results"
        );


    const activeForScope =
        SC_activeFilters[scope];

    if(
        visibleCount === 0 &&
        (
            activeForScope.school.length ||
            activeForScope.faculty.length ||
            activeForScope.year.length ||
            activeForScope.gender.length
        )
    ){
        

        if(!message){

            message =
                document.createElement(
                    "div"
                );

            message.id =
                "sc-filter-no-results";

            message.className =
                "sc-filter-no-results";

            message.textContent =
                "There is no user matching this description.";

            container.appendChild(
                message
            );

        }

        message.style.display =
            "block";

    }else if(message){

        message.style.display =
            "none";

    }

}


/* =====================================================
INITIALISE FILTER SYSTEM
===================================================== */

function SC_Filters_Initialise(){

    SC_Filters_LoadSavedState();

    SC_Filters_UpdatePrimarySchoolLabel();

    SC_Filters_UpdatePillLabels();

    /*
     * HOME FILTERS
     */

    document
        .querySelectorAll(
            "[data-filter]"
        )
        .forEach(pill => {

            const type =
                pill.dataset.filter;


            /*
             * Institution on Home now works.
             */

            if(
                type === "institution"
            ){

                pill.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();
                        event.stopPropagation();

                        SC_Filters_OpenHomeInstitution(
                            pill
                        );

                    }
                );

                return;

            }


            if(
                !SC_FILTER_OPTIONS[type]
            ){

                return;

            }


            pill.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    SC_Filters_Open(
                        pill,
                        "home",
                        type
                    );

                }
            );

        });


    /*
     * FEED FILTERS
     */

    document
        .querySelectorAll(
            "[data-feed-filter]"
        )
        .forEach(pill => {

            const raw =
                pill.dataset.feedFilter;


            /*
             * Primary institution menu.
             */

            if(
                raw === "school"
            ){

                pill.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();
                        event.stopPropagation();

                        SC_Filters_OpenPrimarySchool(
                            pill
                        );

                    }
                );

                return;

            }


            /*
             * Broader institution filter.
             */

            if(
                raw === "beyond"
            ){

                pill.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();
                        event.stopPropagation();


                        if(
                            SC_primarySchoolMode ===
                            SC_PRIMARY_SCHOOL_MODES.ONLY
                        ){

                            SC_Filters_ShowPrimarySchoolWarning();

                            return;

                        }


                        SC_Filters_Open(
                            pill,
                            "feed",
                            "school"
                        );

                    }
                );

                return;

            }


            if(
                !SC_FILTER_OPTIONS[raw]
            ){

                return;

            }


            pill.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

SC_Filters_Open(
                        pill,
                        "feed",
                        raw
                    );

                }
            );

        });


}


/* =====================================================
HOME INSTITUTION FILTER
===================================================== */

function SC_Filters_OpenHomeInstitution(
    pill
){

    /*
     * The homepage institution filter is the
     * same institution-selection system.
     */

    SC_Filters_Open(
        pill,
        "home",
        "school"
    );


}


/* =====================================================
START FILTER SYSTEM
===================================================== */

SC_Filters_Initialise();

SC_Filters_Apply("home");
SC_Filters_Apply("feed");

/* =====================================================
MODULE: FEED — FILTER PILLS
===================================================== */
document.querySelectorAll(".feed-filter").forEach(filter=>{
    filter.addEventListener("click",()=>{
        document.querySelectorAll(".feed-filter").forEach(item=>{
            item.classList.remove("active");
        });

        filter.classList.add("active");
    });
});


/* =====================================================
   MODULE: MOMENT LIKE ENGINE
===================================================== */

const SC_MOMENT_LIKE_STATE_KEY =
    "secretCrushMomentLikeState";


/* -----------------------------------------------------
   GET A STABLE MOMENT ID
----------------------------------------------------- */

function SC_Moment_GetStablePostId(
    post,
    ownerId = "",
    index = 0
){

    if(post?.id){

        return String(
            post.id
        );

    }


    if(post?.postId){

        return String(
            post.postId
        );

    }


    return (
        ownerId ||
        "moment"
    ) +
    "-post-" +
    index;

}


/* -----------------------------------------------------
   GET CURRENT USER
----------------------------------------------------- */

function SC_Moment_GetCurrentUser(){

    const profile =
        getCurrentProfile();


    if(!profile){

        return {

            userId:
                "local-user",

            name:
                "You",

            username:
                "",

            photo:
                ""

        };

    }


    return {

        userId:
            profile.userId ||
            "local-user",

        name:
            profile.name ||
            "You",

        username:
            profile.username ||
            "",

        photo:
            profile.profilePicture ||
            ""

    };

}


/* -----------------------------------------------------
   READ LIKE STORAGE
----------------------------------------------------- */

function SC_Moment_ReadLikeStorage(){

    try{

        const stored =
            JSON.parse(
                localStorage.getItem(
                    SC_MOMENT_LIKE_STATE_KEY
                ) || "{}"
            );


        return (
            stored &&
            typeof stored === "object"
        )
            ? stored
            : {};

    }catch(error){

        return {};

    }

}


/* -----------------------------------------------------
   SAVE LIKE STORAGE
----------------------------------------------------- */

function SC_Moment_SaveLikeStorage(
    storage
){

    try{

        localStorage.setItem(
            SC_MOMENT_LIKE_STATE_KEY,
            JSON.stringify(
                storage
            )
        );

    }catch(error){

        console.error(
            "Secret Crush: Could not save moment likes.",
            error
        );

    }

}


/* -----------------------------------------------------
   GET LIKE STATE FOR A MOMENT
----------------------------------------------------- */

function SC_Moment_GetLikeState(
    post,
    ownerId = "",
    index = 0
){

    const postId =
        SC_Moment_GetStablePostId(
            post,
            ownerId,
            index
        );


    const storage =
        SC_Moment_ReadLikeStorage();


    const stored =
        storage[postId];


    const baseLikes =
        Number(
            post?.likes
        ) || 0;


    const likedBy =
        Array.isArray(
            stored?.likedBy
        )
            ? stored.likedBy
            : [];


    const count =
        stored &&
        Number.isFinite(
            Number(
                stored.count
            )
        )

            ?

            Number(
                stored.count
            )

            :

            baseLikes;


    return {

        postId,

        count:

            Math.max(
                0,
                count
            ),

        likedBy:
            likedBy
                .slice()
                .sort(
                    (
                        a,
                        b
                    ) =>
                        new Date(
                            a.likedAt
                        ) -
                        new Date(
                            b.likedAt
                        )
                )

    };

}


/* -----------------------------------------------------
   APPLY LIKE STATE TO A POST
----------------------------------------------------- */

function SC_Moment_ApplyLikeState(
    post,
    ownerId = "",
    index = 0
){

    if(!post){

        return post;

    }


    const state =
        SC_Moment_GetLikeState(
            post,
            ownerId,
            index
        );


    return {

        ...post,

        id:
            state.postId,

        likes:
            state.count,

        likedBy:
            state.likedBy

    };

}


/* -----------------------------------------------------
   FORMAT DATE + TIME
----------------------------------------------------- */

function SC_Moment_FormatDateTime(
    timestamp
){

    if(!timestamp){

        return "Date unavailable";

    }


    const date =
        new Date(
            timestamp
        );


    if(
        Number.isNaN(
            date.getTime()
        )
    ){

        return "Date unavailable";

    }


    return new Intl.DateTimeFormat(
        "en-GB",
        {
            day:"2-digit",
            month:"short",
            year:"numeric",
            hour:"numeric",
            minute:"2-digit",
            hour12:true
        }
    ).format(
        date
    );

}


/* -----------------------------------------------------
   TOGGLE LIKE
----------------------------------------------------- */

function SC_Moment_ToggleLike(
    post
){

    if(!post){

        return null;

    }


    const currentUser =
        SC_Moment_GetCurrentUser();


    const state =
        SC_Moment_GetLikeState(
            post
        );


    const existingIndex =
        state.likedBy.findIndex(
            person =>
                person.userId ===
                currentUser.userId
        );


    /*
     * ALREADY LIKED
     *
     * Tapping again removes that user's like.
     *
     * It can NEVER create a second like from
     * the same user.
     */

    if(
        existingIndex !== -1
    ){

        state.likedBy.splice(
            existingIndex,
            1
        );

        state.count =
            Math.max(
                0,
                state.count - 1
            );

    }


    /*
     * NOT YET LIKED
     */

    else{

        state.likedBy.push({

            userId:
                currentUser.userId,

            name:
                currentUser.name,

            username:
                currentUser.username,

            photo:
                currentUser.photo,

            likedAt:
                new Date()
                    .toISOString()

        });


        state.count++;

    }


    /*
     * Re-sort chronologically.
     */

    state.likedBy.sort(
        (
            a,
            b
        ) =>
            new Date(
                a.likedAt
            ) -
            new Date(
                b.likedAt
            )
    );


    const storage =
        SC_Moment_ReadLikeStorage();


    storage[
        state.postId
    ] = {

        count:
            state.count,

        likedBy:
            state.likedBy

    };


    SC_Moment_SaveLikeStorage(
        storage
    );


    /*
     * If this is one of the user's own stored
     * moments, also write the like information
     * into secretCrushMoments.
     */

    try{

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "secretCrushMoments"
                ) || "[]"
            );


        if(
            Array.isArray(
                saved
            )
        ){

            const updated =
                saved.map(
                    savedPost => {

                        if(
                            String(
                                savedPost.id
                            ) !==
                            String(
                                state.postId
                            )
                        ){

                            return savedPost;

                        }


                        return {

                            ...savedPost,

                            likes:
                                state.count,

                            likedBy:
                                state.likedBy

                        };

                    }
                );


            localStorage.setItem(
                "secretCrushMoments",
                JSON.stringify(
                    updated
                )
            );

        }

    }catch(error){

        console.warn(
            "Secret Crush: Could not update stored moment like data.",
            error
        );

    }


    return state;

}


/* -----------------------------------------------------
   CHECK WHETHER CURRENT USER LIKED
----------------------------------------------------- */

function SC_Moment_IsLikedByCurrentUser(
    post
){

    const currentUser =
        SC_Moment_GetCurrentUser();


    const state =
        SC_Moment_GetLikeState(
            post
        );


    return state.likedBy.some(
        person =>
            person.userId ===
            currentUser.userId
    );

}


/* -----------------------------------------------------
   CREATE A TEMPORARY FEED ARTICLE FOR
   SEND CRUSH / SECRET NOTE
----------------------------------------------------- */

function SC_Moment_CreateActionProxy(
    post
){

    const proxy =
        document.createElement(
            "article"
        );


    proxy.dataset.postId =
        post.id ||
        "";


    proxy.className =
        "feed-card";


    proxy.innerHTML = `

        <div class="feed-user">

            <div class="feed-user-info">

                <img
                    src="${
                        post.profilePicture ||
                        post.photo ||
                        ""
                    }"
                    alt=""
                >

                <div>

                    <h3>
                        ${escapePostHTML(
                            post.name ||
                            post.username ||
                            "Secret Crush"
                        )}
                    </h3>

                </div>

            </div>

        </div>

    `;


    return proxy;

}


/* =====================================================
FEED POST ACTIONS
===================================================== */

function attachFeedPostActions(
    article
){

    if(!article){

        return;

    }


    const crushButton =
        article.querySelector(
            ".crush-action"
        );


    const noteButton =
        article.querySelector(
            ".note-action"
        );


    if(crushButton){

        crushButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                openSendRevealModal(
                    "crush",
                    article
                );

            }
        );

    }


    if(noteButton){

        noteButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                openSendRevealModal(
                    "note",
                    article
                );

            }
        );

    }

}



/* =====================================================
   UNIVERSAL MOMENT LIKE UI SYNC
===================================================== */

function SC_Moment_SyncLikeUI(
    postId,
    state
){

    if(
        !postId ||
        !state
    ){

        return;

    }


    const currentUser =
        SC_Moment_GetCurrentUser();


    const liked =
        state.likedBy.some(
            person =>
                person.userId ===
                currentUser.userId
        );


    /*
     * ---------------------------------------------
     * FEED / HOME PREVIEWS
     * ---------------------------------------------
     */

    document
        .querySelectorAll(
            `.like-action[data-feed-like="${CSS.escape(postId)}"]`
        )
        .forEach(
            button => {

                const icon =
                    button.querySelector(
                        ".like-icon"
                    );


                const count =
                    button.querySelector(
                        ".like-count"
                    );


                if(icon){

                    icon.textContent =
                        liked
                            ? "♥"
                            : "♡";

                }


                if(count){

                    count.textContent =
                        state.count;

                }


                button.classList.toggle(
                    "liked",
                    liked
                );

            }
        );


    /*
     * ---------------------------------------------
     * MY SPACE / MY POSTS
     * ---------------------------------------------
     */

    document
        .querySelectorAll(
            `.my-post-card[data-post-id="${CSS.escape(postId)}"] .my-post-likes-count`
        )
        .forEach(
            count => {

                count.textContent =
                    state.count;

            }
        );


    /*
     * ---------------------------------------------
     * DETAILED PROFILE POST PREVIEW
     * ---------------------------------------------
     */

    document
        .querySelectorAll(
            `.mutual-profile-post-card[data-mutual-post-id="${CSS.escape(postId)}"] .mutual-profile-post-likes-count`
        )
        .forEach(
            count => {

                count.textContent =
                    state.count;

            }
        );


    /*
     * ---------------------------------------------
     * FEED FULLSCREEN VIEWER
     * ---------------------------------------------
     */

    const feedViewerCards =
    SC_FeedMomentViewer
        ? SC_FeedMomentViewer.querySelectorAll(
            `.sc-feed-moment-panel[data-feed-moment-id="${CSS.escape(String(postId))}"]`
        )
        : [];


feedViewerCards.forEach(
    card => {

        const feedViewerLike =
            card.querySelector(
                "[data-feed-moment-like]"
            );


        if(!feedViewerLike){

            return;

        }


        const icon =
            feedViewerLike.querySelector(
                ".sc-feed-moment-like-icon"
            );


        const count =
            feedViewerLike.querySelector(
                ".sc-feed-moment-like-count"
            );


        if(icon){

            icon.textContent =
                liked
                    ? "♥"
                    : "♡";

        }


        if(count){

            count.textContent =
                state.count;

        }


        feedViewerLike.classList.toggle(
            "liked",
            liked
        );

    }
);

    /*
     * ---------------------------------------------
     * DETAILED PROFILE FULLSCREEN VIEWER
     * ---------------------------------------------
     */

    document
        .querySelectorAll(
            `[data-profile-moment-like][data-post-id="${CSS.escape(postId)}"]`
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "liked",
                    liked
                );


                const icon =
                    button.querySelector(
                        ".sc-profile-moment-like-icon"
                    );


                const count =
                    button.querySelector(
                        ".sc-profile-moment-like-count"
                    );


                if(icon){

                    icon.textContent =
                        liked
                            ? "♥"
                            : "♡";

                }


                if(count){

                    count.textContent =
                        state.count;

                }

            }
        );

}



/* =====================================================
   UNIVERSAL MOMENT LIKE HANDLER
===================================================== */
document.addEventListener(
    "click",
    event => {

        const likeButton =
            event.target.closest(
                ".like-action"
            );


        if(!likeButton){

            return;

        }


        event.preventDefault();
        event.stopPropagation();


        const postId =
            likeButton.dataset.feedLike;


        if(!postId){

            return;

        }


        let post = {

            id:
                postId,

            likes:
                Number(
                    likeButton
                        .querySelector(
                            ".like-count"
                        )
                        ?.textContent
                ) || 0

        };


        /*
         * -----------------------------------------
         * GET COMPLETE STORED POST
         * -----------------------------------------
         */

        try{

            const saved =
                JSON.parse(
                    localStorage.getItem(
                        "secretCrushMoments"
                    ) || "[]"
                );


            if(
                Array.isArray(
                    saved
                )
            ){

                const storedPost =
                    saved.find(
                        item =>
                            String(
                                item.id
                            ) ===
                            String(
                                postId
                            )
                    );


                if(storedPost){

                    post =
                        storedPost;

                }

            }

        }catch(error){

            /*
             * Keep DOM fallback.
             */

        }


        /*
         * -----------------------------------------
         * TOGGLE LIKE
         * -----------------------------------------
         */

        const state =
            SC_Moment_ToggleLike(
                post
            );


        if(!state){

            return;

        }


        /*
         * -----------------------------------------
         * SYNCHRONIZE EVERY VISIBLE COPY
         * -----------------------------------------
         */

        SC_Moment_SyncLikeUI(
            postId,
            state
        );


        /*
         * -----------------------------------------
         * QUEST TRACKING
         * -----------------------------------------
         */

        if(
            state.likedBy.some(
                person =>
                    person.userId ===
                    SC_Moment_GetCurrentUser()
                        .userId
            ) &&
            typeof SCQ_RecordAction ===
            "function"
        ){

            SCQ_RecordAction(
                "moment_liked"
            );

        }

    }
);

/* =====================================================
HANDLE EXISTING DUMMY FEED BUTTONS
===================================================== */

document
    .querySelectorAll(
        ".feed-card"
    )
    .forEach(
        attachFeedPostActions
    );


/* =====================================================
EXISTING RECOMMENDATION CRUSH BUTTONS
===================================================== */

document
    .querySelectorAll(
        ".crush-button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    alert(
                        "Send Crush will use the same reveal system."
                    );

                }
            );

        }
    );

/* =====================================================
SEND CRUSH / SECRET NOTE
===================================================== */

const sendRevealModal =
    document.getElementById(
        "send-reveal-modal"
    );

const sendRevealClose =
    document.getElementById(
        "send-reveal-close"
    );

const sendRevealBackdrop =
    document.getElementById(
        "send-reveal-backdrop"
    );

const sendRevealTitle =
    document.getElementById(
        "send-reveal-title"
    );

const sendRevealEyebrow =
    document.getElementById(
        "send-reveal-eyebrow"
    );

const sendRevealIcon =
    document.getElementById(
        "send-reveal-icon"
    );

const sendRevealSubmit =
    document.getElementById(
        "send-reveal-submit"
    );

const revealShowAll =
    document.getElementById(
        "reveal-show-all"
    );

const revealHideAll =
    document.getElementById(
        "reveal-hide-all"
    );

const crushClueBuilder =
    document.getElementById(
        "crush-clue-builder"
    );

const secretNoteComposer =
    document.getElementById(
        "secret-note-composer"
    );

let outgoingMessageType =
    "crush";

let outgoingTargetPost =
    null;


/* =====================================================
OPEN
===================================================== */

function openSendRevealModal(
    type,
    article
){

    outgoingMessageType =
        type;


    outgoingTargetPost =
        article;


    const personName =
        article.querySelector(
            ".feed-user-info h3"
        )?.textContent ||
        "this person";


    if(type === "crush"){

        sendRevealEyebrow.textContent =
            "SEND A CRUSH";

        sendRevealTitle.textContent =
            `Send a crush to ${personName}`;

        sendRevealIcon.textContent =
            "♡";

        sendRevealSubmit.textContent =
            "Send Crush ♡";


        crushClueBuilder.hidden =
            false;

        secretNoteComposer.hidden =
            true;

    }else{

        sendRevealEyebrow.textContent =
            "SECRET NOTE";

        sendRevealTitle.textContent =
            `Send a secret note to ${personName}`;

        sendRevealIcon.textContent =
            "✉";

        sendRevealSubmit.textContent =
            "Send Secret Note ✉";


        crushClueBuilder.hidden =
            true;

        secretNoteComposer.hidden =
            false;

    }


    if(sendRevealModal){

        sendRevealModal.hidden =
            false;

    }

}


/* =====================================================
SHOW ALL
===================================================== */

revealShowAll?.addEventListener(
    "click",
    () => {

        document
            .querySelectorAll(
                "#reveal-selection-list input[type='checkbox']"
            )
            .forEach(
                checkbox => {

                    checkbox.checked =
                        true;

                }
            );

    }
);


/* =====================================================
HIDE ALL
===================================================== */

revealHideAll?.addEventListener(
    "click",
    () => {

        document
            .querySelectorAll(
                "#reveal-selection-list input[type='checkbox']"
            )
            .forEach(
                checkbox => {

                    checkbox.checked =
                        false;

                }
            );

    }
);


/* =====================================================
SEND
===================================================== */

sendRevealSubmit?.addEventListener(
    "click",
    () => {

        if(!outgoingTargetPost){
            return;
        }


        const selectedFields =
            Array.from(
                document.querySelectorAll(
                    "#reveal-selection-list input:checked"
                )
            ).map(
                checkbox =>
                    checkbox.value
            );


        const clues =
            Array.from(
                document.querySelectorAll(
                    ".outgoing-clue-input"
                )
            )
            .map(
                input =>
                    input.value.trim()
            )
            .filter(Boolean);


        const secretNote =
            document
                .getElementById(
                    "secret-note-input"
                )
                ?.value
                .trim() || "";


        const targetName =
            outgoingTargetPost.querySelector(
                ".feed-user-info h3"
            )?.textContent ||
            "Unknown";


        /*
         * Build a full snapshot of the person being
         * crushed on, captured right now, so the Sent
         * Crushes list and detail view always have
         * something to show — even for a real feed
         * post or a moment, not just the fixed demo
         * people in SC_DEMO_CRUSHES.
         *
         * Preferred source: the full moment record in
         * "secretCrushMoments" (has separate fields).
         * Fallback: whatever is visible on the card
         * itself in the DOM.
         */

        const targetPostId =
            outgoingTargetPost.dataset.postId;


        let matchedMoment = null;

        try{

            const savedMoments =
                JSON.parse(
                    localStorage.getItem(
                        "secretCrushMoments"
                    ) || "[]"
                );

            if(Array.isArray(savedMoments)){

                matchedMoment =
                    savedMoments.find(
                        moment =>
                            moment.id === targetPostId
                    ) || null;

            }

        }catch(error){

            matchedMoment = null;

        }


        const domPhoto =
            outgoingTargetPost.querySelector(
                ".feed-user-info img"
            )?.src || "";

        const domAcademicText =
            outgoingTargetPost.querySelector(
                ".feed-user-info p"
            )?.textContent || "";

        const domAcademicParts =
            domAcademicText
                .split("•")
                .map(part => part.trim())
                .filter(Boolean);


        const targetSnapshot = {

            id:
                targetPostId ||
                null,

            username:
                matchedMoment?.username ||
                "",

            name:
                matchedMoment?.name ||
                targetName,

            photo:
                matchedMoment?.profilePicture ||
                domPhoto ||
                "",

            school:
                matchedMoment?.institution ||
                domAcademicParts[0] ||
                "",

            faculty:
                matchedMoment?.faculty ||
                (
                    domAcademicParts.length === 3
                        ? domAcademicParts[1]
                        : ""
                ),

            year:
                matchedMoment?.year ||
                (
                    domAcademicParts.length === 3
                        ? domAcademicParts[2]
                        : domAcademicParts[1] || ""
                )

        };


        const sentItem = {

            id:
                "sent-" +
                Date.now(),

            type:
                outgoingMessageType,


read:
    false,

opened:
    false,

recipientOpened:
    false,

sentAt:
    Date.now(),
    
            targetName,

            targetId:
                targetPostId,

            targetPostId,

            targetSnapshot,

            selectedFields,

            clues:
                outgoingMessageType === "crush"
                    ? clues
                    : [],

            note:
                outgoingMessageType === "note"
                    ? secretNote
                    : "",

            status:
                outgoingMessageType === "crush"
                    ? "In Progress"
                    : "Sent",

            level:
                outgoingMessageType === "crush"
                    ? 1
                    : null,

            createdAt:
                Date.now()

        };
        
        saveSentCrushOrNote(
    sentItem
);


/* SIDEQUEST — SECRET NOTE */

/* SIDEQUEST — CRUSH / SECRET NOTE */

if(
    typeof SCQ_RecordAction === "function"
){

    if(
        outgoingMessageType === "note"
    ){
        SCQ_RecordAction(
            "secret_note_sent"
        );
    }

    if(
        outgoingMessageType === "crush"
    ){
        SCQ_RecordAction(
            "crush_sent"
        );
    }

}


closeSendRevealModal();


        

        alert(
            outgoingMessageType === "crush"
                ? `Your crush has been sent to ${targetName}.`
                : `Your secret note has been sent to ${targetName}.`
        );

    }
);


/* =====================================================
SAVE SENT ITEM
===================================================== */
function saveSentCrushOrNote(
    item
){

    let existing = [];


    try{

        existing =
            JSON.parse(
                localStorage.getItem(
                    SENT_CRUSH_STORAGE_KEY
                ) ||
                "[]"
            );

    }catch(error){

        existing = [];

    }


    if(!Array.isArray(existing)){

        existing = [];

    }


    /*
     * Remove an older identical record if one exists.
     */

    existing =
        existing.filter(
            savedItem =>
                savedItem.id !== item.id
        );


    /*
     * Newest item goes first.
     */

    existing.unshift(
        item
    );


    localStorage.setItem(
        SENT_CRUSH_STORAGE_KEY,
        JSON.stringify(existing)
    );


    /*
     * If the user sends a new crush to somebody
     * they previously unsent, remove the withdrawal
     * marker so the new crush can appear again.
     */

    if(
        item.type === "crush" &&
        typeof getWithdrawnCrushRecords ===
        "function"
    ){

        const withdrawn =
            getWithdrawnCrushRecords();


        const remainingWithdrawn =
            withdrawn.filter(
                record => {

                    return !(
                        (
                            item.targetId &&
                            record.targetId ===
                            item.targetId
                        )
                        ||
                        (
                            item.targetName &&
                            record.targetName ===
                            item.targetName
                        )
                        ||
                        (
                            item.targetPostId &&
                            record.targetPostId ===
                            item.targetPostId
                        )
                    );

                }
            );


        localStorage.setItem(
            SENT_CRUSH_WITHDRAWN_KEY,
            JSON.stringify(
                remainingWithdrawn
            )
        );

    }


    updateSentCrushCounts();


    /*
     * Refresh the visible Sent Crush list if it
     * happens to be open.
     */

    if(
        sentCrushView &&
        sentCrushView.classList.contains("active")
    ){

        renderSentCrushes();

    }

}


/* =====================================================
CLOSE
===================================================== */

function closeSendRevealModal(){

    if(sendRevealModal){

        sendRevealModal.hidden =
            true;

    }


    outgoingTargetPost =
        null;

}


sendRevealClose?.addEventListener(
    "click",
    closeSendRevealModal
);


sendRevealBackdrop?.addEventListener(
    "click",
    closeSendRevealModal
);







/* =====================================================
MODULE: BOTTOM NAVIGATION VISIBILITY
===================================================== */

/* =====================================================
MODULE: BOTTOM NAVIGATION VISIBILITY
===================================================== */

function showAppNavigation(){

    const navigation=
        document.querySelector(
            ".bottom-navigation"
        );

    if(navigation){

        navigation.classList.add(
            "app-navigation-visible"
        );

    }

}


function hideAppNavigation(){

    const navigation=
        document.querySelector(
            ".bottom-navigation"
        );

    if(navigation){

        navigation.classList.remove(
            "app-navigation-visible"
        );

    }

}


/* =====================================================
MODULE: BOTTOM NAVIGATION — ACTIVE STATE
===================================================== */

function setActiveNavigation(page){

    document.querySelectorAll(".nav-item").forEach(item=>{

        item.classList.remove("active");

    });


    const activeItem=
        document.querySelector(
            `.nav-item[data-page="${page}"]`
        );


    if(activeItem){

        activeItem.classList.add("active");

    }

}

/* =====================================================
   MODULE: FEED MOMENT FULL-SCREEN VIEWER
===================================================== */

let SC_FeedMomentViewer = null;

let SC_FeedMomentItems = [];

let SC_FeedMomentIndex = 0;

let SC_FeedMomentTouchStartY = 0;

let SC_FeedMomentTouchEndY = 0;

let SC_FeedMomentLastTap = 0;


/* -----------------------------------------------------
   GET POST FROM A FEED CARD
----------------------------------------------------- */

function SC_Moment_ReadPostFromCard(
    card
){

    if(!card){

        return null;

    }


    const postId =
        card.dataset.postId ||
        "";


    /*
     * First try the permanent stored moment.
     */

    try{

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "secretCrushMoments"
                ) || "[]"
            );


        if(
            Array.isArray(
                saved
            )
        ){

            const stored =
                saved.find(
                    post =>
                        String(
                            post.id
                        ) ===
                        String(
                            postId
                        )
                );


            if(stored){

                return SC_Moment_ApplyLikeState(
                    stored
                );

            }

        }

    }catch(error){

        /* Continue with DOM fallback. */

    }


    const image =
        card.querySelector(
            ".feed-media img"
        )?.src ||
        "";


    const caption =
        card.querySelector(
            ".feed-caption"
        )?.textContent
        ?.trim() ||
        "";


    const text =
        card.querySelector(
            ".feed-post-text"
        )?.textContent
        ?.trim() ||
        "";


    const name =
        card.querySelector(
            ".feed-user-info h3"
        )?.textContent
        ?.trim() ||
        "Secret Crush";


    const photo =
        card.querySelector(
            ".feed-user-info img"
        )?.src ||
        "";


    return SC_Moment_ApplyLikeState({

        id:
            postId,

        ownerId:
            card.dataset.ownerId ||
            "",

        name:

            name,

        profilePicture:
            photo,

        institution:
            card.dataset.institution ||
            card.dataset.school ||
            "",

        faculty:
            card.dataset.faculty ||
            "",

        year:
            card.dataset.year ||
            "",

        gender:
            card.dataset.gender ||
            "",

        image:
            image,

        caption:
            caption,

        text:
            text,

        likes:
            Number(
                card.querySelector(
".like-action .like-count"
                )?.textContent
            ) || 0

    });

}


/* -----------------------------------------------------
   GET CURRENT FEED MOMENTS
----------------------------------------------------- */

function SC_FeedMoment_GetItems(){

    const cards =
        Array.from(
            document.querySelectorAll(
                ".feed-card[data-post-id]"
            )
        ).filter(
            card =>
                !card.hidden &&
                getComputedStyle(
                    card
                ).display !== "none"
        );


    return cards
        .map(
            card =>
                SC_Moment_ReadPostFromCard(
                    card
                )
        )
        .filter(Boolean);

}


/* -----------------------------------------------------
   CREATE / OPEN VIEWER
----------------------------------------------------- */

function openFeedMomentViewer(
    postId
){

    SC_FeedMomentItems =
        SC_FeedMoment_GetItems();


    const index =
        SC_FeedMomentItems.findIndex(
            post =>
                String(
                    post.id
                ) ===
                String(
                    postId
                )
        );


    if(index === -1){

        return;

    }


    SC_FeedMomentIndex =
        index;
        
        


    if(
        !SC_FeedMomentViewer
    ){

        SC_FeedMomentViewer =
            document.createElement(
                "div"
            );


        SC_FeedMomentViewer.id =
            "sc-feed-moment-viewer";


        SC_FeedMomentViewer.className =
            "sc-feed-moment-viewer";


        document.body.appendChild(
            SC_FeedMomentViewer
        );

    }


    SC_FeedMoment_Render();


    SC_FeedMomentViewer.classList.add(
        "active"
    );


    SC_FeedMomentViewer.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "sc-moment-viewer-open"
    );

}
/* -----------------------------------------------------
   CREATE ONE FULLSCREEN FEED MOMENT
----------------------------------------------------- */

function SC_FeedMoment_CreateCard(
    post,
    index
){

    const state =
        SC_Moment_GetLikeState(
            post
        );


    const liked =
        SC_Moment_IsLikedByCurrentUser(
            post
        );


    const profilePhoto =
        post.profilePicture ||
        post.photo ||
        "";


    return `

        <section
            class="
                sc-feed-moment-panel
            "
            data-feed-moment-index="${index}"
            data-feed-moment-id="${escapePostHTML(
                post.id || ""
            )}"
        >

            <!-- MOMENT MEDIA -->

            <div
                class="
                    sc-feed-moment-media
                "
                data-sc-feed-moment-doubletap
                data-post-id="${escapePostHTML(
                    post.id || ""
                )}"
            >

           
${
    post.videoMediaId
        ? `
            <video
                class="sc-feed-moment-video"
                data-moment-video-id="${escapePostHTML(post.videoMediaId)}"
                playsinline
                loop
                preload="metadata"
            ></video>

            <button
                type="button"
                class="sc-feed-video-toggle sc-vt-btn"
                aria-label="Play video"
            >▶</button>
        `
        : post.image || post.media || post.photo
            ? `
                <img
                    src="${escapePostHTML(
                        post.image || post.media || post.photo
                    )}"
                    alt="Moment"
                    draggable="false"
                >
            `
            : `
                <div class="sc-feed-moment-text-only">
                    ${escapePostHTML(post.text || "Moment")}
                </div>
            `
}



                <div
                    class="
                        sc-feed-floating-heart
                    "
                    data-floating-heart
                >
                    ♥
                </div>

            </div>


            <!-- SIDE ACTIONS -->

            <aside
                class="
                    sc-feed-moment-actions
                "
            >

                <button
                    type="button"
                    class="
                        sc-feed-moment-action
                        ${
                            liked
                                ? "liked"
                                : ""
                        }
                    "
                    data-feed-moment-like="${escapePostHTML(
                        post.id || ""
                    )}"
                >

                    <span
                        class="sc-feed-moment-like-icon"
                    >
                        ${
                            liked
                                ? "♥"
                                : "♡"
                        }
                    </span>

                    <strong
                        class="sc-feed-moment-like-count"
                    >
                        ${state.count}
                    </strong>

                </button>


                <button
                    type="button"
                    class="
                        sc-feed-moment-action
                    "
                    data-feed-moment-crush="${escapePostHTML(
                        post.id || ""
                    )}"
                >

                    <span>
                        ♡
                    </span>

                    <small>
                        Send Crush
                    </small>

                </button>


                <button
                    type="button"
                    class="
                        sc-feed-moment-action
                    "
                    data-feed-moment-note="${escapePostHTML(
                        post.id || ""
                    )}"
                >

                    <span>
                        ✉
                    </span>

                    <small>
                        Send Note
                    </small>

                </button>

            </aside>


            <!-- BOTTOM INFORMATION -->

            <div
                class="
                    sc-feed-moment-bottom
                "
            >

                <div
                    class="
                        sc-feed-moment-person
                    "
                    data-feed-moment-profile="${escapePostHTML(post.id || "")}"
                >

                    ${
                        profilePhoto

                        ?

                        `
                        <img
                            src="${escapePostHTML(
                                profilePhoto
                            )}"
                            alt=""
                        >
                        `

                        :

                        `
                        <div
                            class="
                                sc-feed-moment-avatar-fallback
                            "
                        >
                            ?
                        </div>
                        `
                    }


                    <div>

                        <strong>
                            ${escapePostHTML(
                                post.name ||
                                post.username ||
                                "Secret Crush"
                            )}
                        </strong>

                        <small>
                            ${
                                post.createdAt
                                    ? SC_Moment_FormatDateTime(
                                        post.createdAt
                                    )
                                    : "Moment"
                            }
                        </small>

                    </div>

                </div>


                ${
                    post.caption ||
                    post.text

                    ?

                    `
                    <p
                        class="
                            sc-feed-moment-caption
                        "
                    >
                        ${escapePostHTML(
                            post.caption ||
                            post.text ||
                            ""
                        )}
                    </p>
                    `

                    :

                    ""
                }

            </div>

        </section>

    `;

}
/* -----------------------------------------------------
   ACTIVE FEED MOMENT OBSERVER
----------------------------------------------------- */

function SC_FeedMoment_SetupObserver(){

    const scroll =
        document.getElementById(
            "sc-feed-moment-scroll"
        );


    if(!scroll){

        return;

    }


    const cards =
        scroll.querySelectorAll(
            ".sc-feed-moment-panel"
        );


    if(!cards.length){

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                let bestEntry =
                    null;


                entries.forEach(
                    entry => {

                        if(
                            !entry.isIntersecting
                        ){

                            return;

                        }


                        if(
                            !bestEntry ||
                            entry.intersectionRatio >
                            bestEntry.intersectionRatio
                        ){

                            bestEntry =
                                entry;

                        }

                    }
                );


                if(!bestEntry){

                    return;

                }


                const index =
                    Number(
                        bestEntry.target.dataset
                            .feedMomentIndex
                    );


                if(
                    Number.isNaN(index)
                ){

                    return;

                }


                SC_FeedMomentIndex =
                    index;
                    /* Play only the video in the active fullscreen moment. */
cards.forEach(card => {
    const video = card.querySelector(
        ".sc-feed-moment-video"
    );

    if (!video) return;

        if (card === bestEntry.target) {
        SC_VT_Play(video);
    } else {
        video.pause();
    }
});

            },
            {

                root:
                    scroll,

                threshold:[
                    .55,
                    .7,
                    .85
                ]

            }
        );


    cards.forEach(
        card =>
            observer.observe(
                card
            )
    );

}

/* -----------------------------------------------------
   SCROLL TO FEED MOMENT
----------------------------------------------------- */

function SC_FeedMoment_ScrollToIndex(
    index,
    smooth = true
){

    const scroll =
        document.getElementById(
            "sc-feed-moment-scroll"
        );


    if(!scroll){

        return;

    }


    const cards =
        scroll.querySelectorAll(
            ".sc-feed-moment-panel"
        );


    const card =
        cards[index];


    if(!card){

        return;

    }


    card.scrollIntoView({
        behavior:
            smooth
                ? "smooth"
                : "auto",

        block:
            "start"
    });
    
    SC_Moment_HydrateVideoElements(
    document.getElementById("sc-feed-moment-scroll")
);

}



/* -----------------------------------------------------
   RENDER CURRENT MOMENT
----------------------------------------------------- */
function SC_FeedMoment_Render(){

    if(
        !SC_FeedMomentViewer
    ){

        return;

    }


    /*
     * Render ALL Feed moments into one
     * vertical fullscreen scroll container.
     */

    SC_FeedMomentViewer.innerHTML = `

        <div
            class="sc-feed-moment-backdrop"
            data-sc-moment-close
        ></div>


        <!-- BACK BUTTON -->

        <button
            type="button"
            class="sc-feed-moment-back"
            data-sc-moment-close
            aria-label="Back"
        >
            ‹
        </button>


        <!-- FLOATING TOP TOOLS -->

        <div
            class="
                sc-feed-moment-floating-tools
            "
            id="sc-feed-moment-floating-tools"
        >

            <button
                type="button"
                class="sc-feed-moment-tool"
                aria-label="Search"
            >
                ⌕
            </button>


            <button
                type="button"
                class="sc-feed-moment-tool"
                aria-label="More"
            >
                ♨
            </button>

        </div>


        <!-- VERTICAL MOMENT SCROLL -->

        <div
            class="sc-feed-moment-scroll"
            id="sc-feed-moment-scroll"
        >

            ${
                SC_FeedMomentItems
                    .map(
                        (
                            post,
                            index
                        ) =>
                            SC_FeedMoment_CreateCard(
                                post,
                                index
                            )
                    )
                    .join("")
            }

        </div>

    `;


    /*
     * Attach all interactions.
     */

    SC_FeedMoment_AttachEvents();


/*
 * Move to the moment that was
 * originally tapped.
 */

requestAnimationFrame(
    () => {

        SC_FeedMoment_ScrollToIndex(
            SC_FeedMomentIndex,
            false
        );

    }
);


    /*
     * Track which moment is currently
     * visible.
     */

    SC_FeedMoment_SetupObserver();

}


/* -----------------------------------------------------
   ATTACH VIEWER EVENTS
----------------------------------------------------- */
/* -----------------------------------------------------
   ATTACH VIEWER EVENTS
----------------------------------------------------- */

function SC_FeedMoment_AttachEvents(){

    if(
        !SC_FeedMomentViewer
    ){

        return;

    }


    /*
     * =================================================
     * CLOSE
     * =================================================
     */

    SC_FeedMomentViewer
        .querySelectorAll(
            "[data-sc-moment-close]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    closeFeedMomentViewer
                );

            }
        );


    /*
     * =================================================
     * LIKE BUTTONS
     * =================================================
     */

    SC_FeedMomentViewer
        .querySelectorAll(
            "[data-feed-moment-like]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        const postId =
                            button.dataset
                                .feedMomentLike;


                        const post =
                            SC_FeedMomentItems.find(
                                item =>
                                    String(
                                        item.id
                                    ) ===
                                    String(
                                        postId
                                    )
                            );


                        if(!post){

                            return;

                        }


                        const state =
                            SC_Moment_ToggleLike(
                                post
                            );


                        if(!state){

                            return;

                        }


                        /*
                         * Update Feed preview,
                         * fullscreen,
                         * My Posts,
                         * profile preview,
                         * etc.
                         */

                        SC_Moment_SyncLikeUI(
                            postId,
                            state
                        );

                    }
                );

            }
        );


    /*
     * =================================================
     * SEND CRUSH
     * =================================================
     */

    SC_FeedMomentViewer
        .querySelectorAll(
            "[data-feed-moment-crush]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        const postId =
                            button.dataset
                                .feedMomentCrush;


                        const post =
                            SC_FeedMomentItems.find(
                                item =>
                                    String(
                                        item.id
                                    ) ===
                                    String(
                                        postId
                                    )
                            );


                        if(!post){

                            return;

                        }


                        openSendRevealModal(
                            "crush",
                            SC_Moment_CreateActionProxy(
                                post
                            )
                        );

                    }
                );

            }
        );


    /*
     * =================================================
     * SECRET NOTE
     * =================================================
     */

    SC_FeedMomentViewer
        .querySelectorAll(
            "[data-feed-moment-note]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        const postId =
                            button.dataset
                                .feedMomentNote;


                        const post =
                            SC_FeedMomentItems.find(
                                item =>
                                    String(
                                        item.id
                                    ) ===
                                    String(
                                        postId
                                    )
                            );


                        if(!post){

                            return;

                        }


                        openSendRevealModal(
                            "note",
                            SC_Moment_CreateActionProxy(
                                post
                            )
                        );

                    }
                );

            }
        );


    /*
     * =================================================
     * DOUBLE-TAP TO LIKE
     *
     * This deliberately mirrors the working
     * fullscreen profile-moment implementation.
     * =================================================
     */

    SC_FeedMomentViewer
        .querySelectorAll(
            ".sc-feed-moment-media"
        )
        .forEach(
            media => {

                let lastTap =
                    0;


                media.addEventListener(
                    "touchend",
                    event => {

                        const now =
                            Date.now();


                        if(
                            now -
                            lastTap <
                            320
                        ){

                            event.preventDefault();
                            event.stopPropagation();


                            const card =
                                media.closest(
                                    ".sc-feed-moment-panel"
                                );


                            if(!card){

                                return;

                            }


                            const postId =
                                card.dataset
                                    .feedMomentId;


                            const post =
                                SC_FeedMomentItems.find(
                                    item =>
                                        String(
                                            item.id
                                        ) ===
                                        String(
                                            postId
                                        )
                                );


                            if(!post){

                                return;

                            }


                            /*
                             * Double-tap should LIKE,
                             * not unlike an already-liked
                             * moment.
                             */

                            const alreadyLiked =
                                SC_Moment_IsLikedByCurrentUser(
                                    post
                                );


                            if(!alreadyLiked){

                                const state =
                                    SC_Moment_ToggleLike(
                                        post
                                    );


                                if(state){

                                    SC_Moment_SyncLikeUI(
                                        postId,
                                        state
                                    );

                                }

                            }


                            /*
                             * Show the large heart in
                             * THIS moment's media area.
                             */

                            const floatingHeart =
                                media.querySelector(
                                    "[data-floating-heart]"
                                );


                            if(floatingHeart){

                                floatingHeart.classList.remove(
                                    "show"
                                );


                                void floatingHeart.offsetWidth;


                                floatingHeart.classList.add(
                                    "show"
                                );

                            }

                        }


                        lastTap =
                            now;

                    },
                    {
                        passive:false
                    }
                );

            }
        );

}





/* -----------------------------------------------------
   CLOSE
----------------------------------------------------- */

function closeFeedMomentViewer(){
    
        SC_Moment_RefreshAllLikeUI();

    if(
        !SC_FeedMomentViewer
    ){
        
        

        return;

    }


    SC_FeedMomentViewer.classList.remove(
        "active"
    );


    SC_FeedMomentViewer.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "sc-moment-viewer-open"
    );

}


/* -----------------------------------------------------
   OPEN WHEN A FEED MOMENT IS TAPPED
----------------------------------------------------- */

document.addEventListener(
    "click",
    event => {

        /*
         * Do not open the viewer when the user is
         * pressing one of the existing action buttons.
         */

        if(
            event.target.closest(
                ".feed-actions"
            )
        ){

            return;

        }


        if(
            event.target.closest(
                ".feed-user"
            )
        ){

            return;

        }


        const media =
            event.target.closest(
                ".feed-media"
            );


        const text =
            event.target.closest(
                ".feed-caption, .feed-post-text"
            );


        const card =
            event.target.closest(
                ".feed-card[data-post-id]"
            );


        if(
            !card ||
            (!media && !text)
        ){

            return;

        }


        event.preventDefault();


        openFeedMomentViewer(
            card.dataset.postId
        );

    }
);




/* =====================================================
MODULE: NAVIGATION — APPLICATION PAGES
===================================================== */

document.querySelectorAll(".nav-item").forEach(nav=>{

    nav.addEventListener("click",()=>{

        const destination=
            nav.dataset.page;


        setActiveNavigation(destination);

        /* keep Home / Feed / moment badges in sync
           with whatever is in the saved profile */
        if(typeof loadHomepageProfile === "function"){
            loadHomepageProfile();
        }



        homepage.classList.remove("active");
        feedPage.classList.remove("active");

        if(typeof profilePage!=="undefined" && profilePage){
            profilePage.classList.remove("active");
        }
        
        if(typeof streaksPage!=="undefined" && streaksPage) {
    streaksPage.classList.remove("active");
}
if(typeof gameHistoryPage!=="undefined" && gameHistoryPage) {
    gameHistoryPage.classList.remove('active');
}


        if(typeof settingsPage!=="undefined" && settingsPage){
            settingsPage.classList.remove("active");
        }
        
        if(typeof bankPage!=="undefined" && bankPage) {
            bankPage.classList.remove('active');
        }
        
        if(typeof chatsPage!=="undefined" &&chatsPage) {
            chatsPage.classList.remove('active');
        
        }


        /* ---------------------------------------------
        HOME
        --------------------------------------------- */

        if(destination==="home"){

            homepage.classList.add("active");

            homepage.scrollTop=0;
            loadSavedMoments();
            

            showAppNavigation();

            return;
        }


        /* ---------------------------------------------
        FEED
        --------------------------------------------- */

        if(destination==="feed"){

            feedPage.classList.add("active");
            SC_Filters_Apply("feed");

            feedPage.scrollTop=0;

            showAppNavigation();
            loadSavedMoments();

            return;
        }


        /* ---------------------------------------------
        PROFILE
        --------------------------------------------- */

        if(destination==="profile"){

            if(
                typeof profilePage!=="undefined" &&
                profilePage
            ){

                profilePage.classList.add("active");

                profilePage.scrollTop=0;

                loadProfilePage();

                showAppNavigation();

            }

            return;
        }
        


        /* ---------------------------------------------
        SETTINGS
        --------------------------------------------- */

        if(destination==="settings"){

            if(
                typeof settingsPage!=="undefined" &&
                settingsPage
            ){

                settingsPage.classList.add("active");

                settingsPage.scrollTop=0;

                loadSettings();

                showAppNavigation();

            }

            return;
        }


        /* ---------------------------------------------
        BANK
        --------------------------------------------- */

        if(destination==="bank"){

    bankPage.classList.add("active");
    bankPage.scrollTop=0;

    updateBankBalance();
    showAppNavigation();

    return;
}


/* ---------------------------------------------
STREAKS
--------------------------------------------- */

if(destination==="streaks"){

    openStreaksPage();

    return;
}

        /* ---------------------------------------------
        CHATS
        --------------------------------------------- */

       if(destination==="chats"){

    if(chatsPage){

        chatsPage.classList.add("active");

        chatsPage.scrollTop = 0;

        renderChatList();

        showAppNavigation();

    }

    return;
}

    });

});





/* =====================================================
MODULE: PROFILE — ELEMENT REFERENCES
===================================================== */

const profilePage=document.getElementById("profile-page");
const settingsPage=
    document.getElementById("settings-page");

const profilePagePicture=
    document.getElementById("profile-page-picture");

const profilePageAbout=
    document.getElementById("profile-page-about");
    
const profilePageName=
    document.getElementById("profile-page-name");

const profilePageUsername=
    document.getElementById("profile-page-username");

const profilePageInstitution=
    document.getElementById("profile-page-institution");

const profilePageFaculty=
    document.getElementById("profile-page-faculty");

const profilePageYear=
    document.getElementById("profile-page-year");

const profileCrushesCount=
    document.getElementById("profile-crushes-count");

const profileNotesCount=
    document.getElementById("profile-notes-count");

const profileInterestList=
    document.getElementById("profile-interest-list");

const profileInfoInstitution=
    document.getElementById("profile-info-institution");

const profileInfoFaculty=
    document.getElementById("profile-info-faculty");

const profileInfoYear=
    document.getElementById("profile-info-year");

const profileInfoGender=
    document.getElementById("profile-info-gender");
    const profileCrushesSentCount=
    document.getElementById(
        "profile-crushes-sent-count"
    );

const profileFollowingCount=
    document.getElementById(
        "profile-following-count"
    );

const profileFollowersCount=
    document.getElementById(
        "profile-followers-count"
    );

const profileFollowingPreview=
    document.getElementById(
        "profile-following-preview"
    );

const profileFollowersPreview=
    document.getElementById(
        "profile-followers-preview"
    );

const profileFollowingViewAll=
    document.getElementById(
        "profile-following-view-all"
    );

const profileFollowersViewAll=
    document.getElementById(
        "profile-followers-view-all"
    );

const profileFollowingPreviewCount=
    document.getElementById(
        "profile-following-preview-count"
    );

const profileFollowersPreviewCount=
    document.getElementById(
        "profile-followers-preview-count"
    );
    // PROFILE STATS DROPDOWN
const profileStatsDropdown =
    document.getElementById("profile-stats-dropdown");

const profileStatsExtra =
    document.getElementById("profile-stats-extra");

if (profileStatsDropdown && profileStatsExtra) {

    profileStatsDropdown.addEventListener("click", () => {

        const isOpen =
            profileStatsDropdown.getAttribute("aria-expanded") === "true";

        const nextState = !isOpen;

        profileStatsDropdown.setAttribute(
            "aria-expanded",
            String(nextState)
        );

        profileStatsExtra.hidden = !nextState;

        profileStatsDropdown.classList.toggle(
            "is-open",
            nextState
        );

    });

}



/* =====================================================
MODULE: PROFILE — LOAD USER DATA
===================================================== */

function loadProfilePage(){

    const savedProfile=
        localStorage.getItem("secretCrushProfile");

    if(!savedProfile){
        return;
    }

    let profile;

    try{

        profile=JSON.parse(savedProfile);

    }catch(error){

        console.error(
            "Unable to load profile:",
            error
        );

        return;
    }


    /* =================================================
    BASIC PROFILE INFORMATION
    ================================================= */

    if(profilePageName){
        profilePageName.textContent=
            profile.name || "Your Name";
    }


    if(profilePageInstitution){
        profilePageInstitution.textContent=
            profile.institution || "Institution";
    }


    if(profilePageFaculty){
        profilePageFaculty.textContent=
            profile.faculty || "Faculty";
    }


    if(profilePageYear){

        const yearLabels={
            "1":"1st Year",
            "2":"2nd Year",
            "3":"3rd Year",
            "4":"4th Year",
            "5":"5th Year",
            "6":"6th Year+"
        };

        profilePageYear.textContent=
            yearLabels[profile.year] ||
            profile.year ||
            "Year";
    }


    /* =================================================
    PROFILE PICTURE
    ================================================= */
if(
        profile.profilePicture &&
        profilePagePicture
    ){

        profilePagePicture.src=
            profile.profilePicture;

    }


    /* =================================================
    ABOUT (shown beside the profile picture, like WhatsApp)
    ================================================= */

    if(profilePageAbout){

        const about=
            typeof profile.about === "string"
                ? profile.about.trim()
                : "";

        if(about){
            profilePageAbout.textContent = about;
            profilePageAbout.hidden = false;
        }else{
            profilePageAbout.hidden = true;
        }

    }


    /* =================================================
    PROFILE STATS
    ================================================= */

if(profileCrushesSentCount){

    profileCrushesSentCount.textContent =
        getSentCrushes().length;

}

if(profileCrushesCount){

        profileCrushesCount.textContent=
            SC_DEMO_CRUSHES.length;

    }


    if(profileNotesCount){

        profileNotesCount.textContent=
            profile.secretNotesReceived || 0;

    }


    /* =================================================
    INTERESTS
    ================================================= */

    if(profileInterestList){

        profileInterestList.innerHTML="";

        if(
            Array.isArray(profile.interests) &&
            profile.interests.length
        ){

            profile.interests.forEach(interest=>{

                const interestElement=
                    document.createElement("span");

                interestElement.className=
                    "profile-interest";

                interestElement.textContent=
                    interest;

                profileInterestList.appendChild(
                    interestElement
                );

            });

        }

    }


    /* =================================================
    PROFILE INFORMATION
    ================================================= */

    if(profileInfoInstitution){

        profileInfoInstitution.textContent=
            profile.institution || "—";

    }


    if(profileInfoFaculty){

        profileInfoFaculty.textContent=
            profile.faculty || "—";

    }


    if(profileInfoYear){

        const yearLabels={
            "1":"1st Year",
            "2":"2nd Year",
            "3":"3rd Year",
            "4":"4th Year",
            "5":"5th Year",
            "6":"6th Year+"
        };

        profileInfoYear.textContent=
            yearLabels[profile.year] ||
            profile.year ||
            "—";

    }


    if(profileInfoGender){

        profileInfoGender.textContent=
            profile.gender || "—";

    }
    
    renderProfileNetwork();

}

/* =====================================================
MODULE: PROFILE — FOLLOWING / FOLLOWERS
===================================================== */

const SC_FOLLOWING_KEY =
    "secretCrushFollowing";

const SC_FOLLOWERS_KEY =
    "secretCrushFollowers";


function SC_ProfileNetwork_Read(key){

    try{

        const value =
            JSON.parse(
                localStorage.getItem(key) || "[]"
            );

        return Array.isArray(value)
            ? value
            : [];

    }catch(error){

        return [];

    }

}


function SC_ProfileNetwork_Save(key,list){

    localStorage.setItem(
        key,
        JSON.stringify(
            Array.isArray(list)
                ? list
                : []
        )
    );

}

function SC_ProfileNetwork_NormalizePerson(person){

    if(!person){
        return null;
    }


    return {

        id:
            person.id ||
            person.targetId ||
            person.username ||
            `profile-${Date.now()}`,


        name:
            person.name ||
            person.username ||
            "Secret Crush",


        username:
            person.username ||
            person.name ||
            "",


        photo:
            person.photo ||
            person.profilePicture ||
            "",


        school:
            person.school ||
            person.institution ||
            "",


        faculty:
            person.faculty ||
            "",


        year:
            person.year ||
            "",


        about:
            person.about ||
            "",


        interests:
            Array.isArray(person.interests)

                ?

                [...person.interests]

                :

                [],


        posts:
            Array.isArray(person.posts)

                ?

                [...person.posts]

                :

                [],


        gender:
            person.gender ||
            "",


        /*
         * IMPORTANT:
         * Preserve the actual reveal state.
         */

        revealed:
            person.revealed &&
            typeof person.revealed === "object"

                ?

                {...person.revealed}

                :

                {},


        revealedFields:
            person.revealedFields &&
            typeof person.revealedFields === "object"

                ?

                {...person.revealedFields}

                :

                undefined,


        revealedProfileFields:
            person.revealedProfileFields &&
            typeof person.revealedProfileFields === "object"

                ?

                {...person.revealedProfileFields}

                :

                undefined,


        fullyRevealed:
            person.fullyRevealed === true,


        profileFullyRevealed:
            person.profileFullyRevealed === true,


        revealComplete:
            person.revealComplete === true,


        mutualRevealed:
            person.mutualRevealed === true,


        /*
         * Preserve any name/alias the viewer had
         * assigned while the real identity was hidden.
         */

        customName:
            person.customName ||
            "",


        alias:
            person.alias ||
            "",


        displayName:
            person.displayName ||
            ""

    };

}




function SC_ProfileNetwork_GetFollowing(){

    return SC_ProfileNetwork_Read(
        SC_FOLLOWING_KEY
    );

}


function SC_ProfileNetwork_GetFollowers(){

    return SC_ProfileNetwork_Read(
        SC_FOLLOWERS_KEY
    );

}


function SC_ProfileNetwork_IsFollowing(id){

    return SC_ProfileNetwork_GetFollowing()
        .some(
            person =>
                person.id === id
        );

}


function SC_ProfileNetwork_Follow(person){

    const normalized =
        SC_ProfileNetwork_NormalizePerson(
            person
        );

    if(!normalized){
        return false;
    }

    const following =
        SC_ProfileNetwork_GetFollowing();


    if(
        following.some(
            item =>
                item.id === normalized.id
        )
    ){

        return true;

    }


    following.unshift(
        normalized
    );


    SC_ProfileNetwork_Save(
        SC_FOLLOWING_KEY,
        following
    );


    renderProfileNetwork();


    return true;

}


function SC_ProfileNetwork_Unfollow(id){

    const following =
        SC_ProfileNetwork_GetFollowing()
            .filter(
                person =>
                    person.id !== id
            );


    SC_ProfileNetwork_Save(
        SC_FOLLOWING_KEY,
        following
    );


    renderProfileNetwork();

}


/*
 * Future backend / realtime hook.
 *
 * When another user follows the current user,
 * the backend can call this function.
 */

function SC_ProfileNetwork_AddFollower(person){

    const normalized =
        SC_ProfileNetwork_NormalizePerson(
            person
        );

    if(!normalized){
        return false;
    }


    const followers =
        SC_ProfileNetwork_GetFollowers();


    if(
        followers.some(
            item =>
                item.id === normalized.id
        )
    ){

        return true;

    }


    followers.unshift(
        normalized
    );


    SC_ProfileNetwork_Save(
        SC_FOLLOWERS_KEY,
        followers
    );


    renderProfileNetwork();


    return true;

}


/* =====================================================
PROFILE NETWORK — PERSON CARD
===================================================== */

function SC_ProfileNetwork_CreateCard(
    person,
    type
){

    const card =
        document.createElement(
            "button"
        );


    card.type =
        "button";


    card.className =
        "profile-network-person-card";


    /*
     * The card must obey the exact same
     * visibility rules as the full profile.
     */

    const revealState =
        SC_Profile_GetRevealState(
            person
        );


    /*
     * Check whether the viewer had assigned
     * this person a custom name while hidden.
     */

    let assignedName = "";


    try{

        const savedNames =
            typeof getCrushNames === "function"

                ?

                getCrushNames()

                :

                {};


        assignedName =
            savedNames[person.id] ||
            "";

    }catch(error){

        assignedName =
            "";

    }


    /*
     * NAME
     *
     * If name is revealed:
     *     show the real username/name.
     *
     * If hidden:
     *     keep the viewer's assigned name/alias.
     */

    const displayName =

        revealState.name

            ?

            (
                person.username ||
                person.name ||
                "Secret Crush"
            )

            :

            (
                assignedName ||
                person.customName ||
                person.alias ||
                person.displayName ||
                "Mystery"
            );


    /*
     * PROFILE PICTURE
     */

    const photo =

        revealState.picture

            ?

            (
                person.photo ||
                person.profilePicture ||
                ""
            )

            :

            "";


    /*
     * SCHOOL
     */

    const school =

        revealState.school

            ?

            (
                person.school ||
                person.institution ||
                ""
            )

            :

            "School hidden";


    /*
     * FACULTY
     */

    const faculty =

        revealState.faculty

            ?

            (
                person.faculty ||
                ""
            )

            :

            "Faculty hidden";


    /*
     * YEAR
     */

    const year =

        revealState.year

            ?

            (
                person.year ||
                ""
            )

            :

            "Year hidden";


    card.innerHTML = `

        <span
            class="profile-network-person-photo"
        >

            ${
                photo

                ?

                `
                <img
                    src="${escapePostHTML(photo)}"
                    alt=""
                >
                `

                :

                `
                <span
                    class="profile-network-person-placeholder"
                >
                    ?
                </span>
                `
            }

        </span>


        <span
            class="profile-network-person-copy"
        >

            <strong>
                ${escapePostHTML(
                    displayName
                )}
            </strong>


            <span
                class="profile-network-person-meta"
            >

                ${escapePostHTML(
                    school
                )}

                <i>•</i>

                ${escapePostHTML(
                    faculty
                )}

                <i>•</i>

                ${escapePostHTML(
                    year
                )}

            </span>

        </span>


        <span
            class="profile-network-person-arrow"
        >
            ›
        </span>

    `;


    card.addEventListener(
        "click",
        () => {

            if(type === "following"){

                openFollowingProfile(
                    person
                );

                return;

            }


            openFollowerProfile(
                person
            );

        }
    );


    return card;

}



/* =====================================================
PROFILE NETWORK — RENDER PREVIEWS
===================================================== */

function renderProfileNetwork(){

    const following =
        SC_ProfileNetwork_GetFollowing();

    const followers =
        SC_ProfileNetwork_GetFollowers();


    if(profileFollowingCount){

        profileFollowingCount.textContent =
            following.length;

    }


    if(profileFollowersCount){

        profileFollowersCount.textContent =
            followers.length;

    }


    if(profileFollowingPreviewCount){

        profileFollowingPreviewCount.textContent =
            `${following.length} ${
                following.length === 1
                    ? "person"
                    : "people"
            }`;

    }


    if(profileFollowersPreviewCount){

        profileFollowersPreviewCount.textContent =
            `${followers.length} ${
                followers.length === 1
                    ? "person"
                    : "people"
            }`;

    }


    /* FOLLOWING PREVIEW */

    if(profileFollowingPreview){

        profileFollowingPreview.innerHTML =
            "";


        if(!following.length){

            profileFollowingPreview.innerHTML = `

                <div
                    class="profile-network-empty"
                >
                    You are not following anyone yet.
                </div>

            `;

        }else{

            following
                .slice(0,3)
                .forEach(person => {

                    profileFollowingPreview.appendChild(

                        SC_ProfileNetwork_CreateCard(
                            person,
                            "following"
                        )

                    );

                });

        }

    }


    /* FOLLOWERS PREVIEW */

    if(profileFollowersPreview){

        profileFollowersPreview.innerHTML =
            "";


        if(!followers.length){

            profileFollowersPreview.innerHTML = `

                <div
                    class="profile-network-empty"
                >
                    You don't have any followers yet.
                </div>

            `;

        }else{

            followers
                .slice(0,3)
                .forEach(person => {

                    profileFollowersPreview.appendChild(

                        SC_ProfileNetwork_CreateCard(
                            person,
                            "followers"
                        )

                    );

                });

        }

    }

}


/* =====================================================
PROFILE NETWORK — FULL LIST
===================================================== */

function openProfileNetworkList(type){

    const people =
        type === "following"
            ? SC_ProfileNetwork_GetFollowing()
            : SC_ProfileNetwork_GetFollowers();


    const title =
        type === "following"
            ? "Following"
            : "Followers";


    let overlay =
        document.getElementById(
            "profile-network-list-view"
        );


    if(!overlay){

        overlay =
            document.createElement(
                "div"
            );

        overlay.id =
            "profile-network-list-view";

        overlay.className =
            "profile-network-list-view";


        document.body.appendChild(
            overlay
        );

    }


    overlay.innerHTML = `

        <div
            class="profile-network-list-backdrop"
            data-close-profile-network
        ></div>


        <section
            class="profile-network-list-panel"
        >

            <header
                class="profile-network-list-header"
            >

                <button
                    type="button"
                    class="profile-network-list-back"
                    data-close-profile-network
                >
                    ‹
                </button>


                <div>

                    <span
                        class="page-eyebrow"
                    >
                        PROFILE
                    </span>

                    <h2>
                        ${title}
                    </h2>

                </div>

            </header>


            <div
                class="profile-network-list-items"
            >

                ${
                    people.length
                    ? ""
                    : `

                        <div
                            class="profile-network-list-empty"
                        >

                            <div>
                                ♡
                            </div>

                            <strong>
                                No ${title.toLowerCase()} yet
                            </strong>

                            <p>
                                People you ${
                                    type === "following"
                                        ? "follow"
                                        : "connect with"
                                } will appear here.
                            </p>

                        </div>

                    `
                }

            </div>

        </section>

    `;


    const list =
        overlay.querySelector(
            ".profile-network-list-items"
        );


    people.forEach(person => {

        list.appendChild(

            SC_ProfileNetwork_CreateCard(
                person,
                type
            )

        );

    });


    overlay
        .querySelectorAll(
            "[data-close-profile-network]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                closeProfileNetworkList
            );

        });


    overlay.classList.add(
        "active"
    );

    overlay.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeProfileNetworkList(){

    const overlay =
        document.getElementById(
            "profile-network-list-view"
        );


    if(!overlay){
        return;
    }


    overlay.classList.remove(
        "active"
    );

    overlay.setAttribute(
        "aria-hidden",
        "true"
    );

}

function openFollowingProfile(person){

    if(!person){
        return;
    }


    closeProfileNetworkList();


    /*
     * If this person also exists in the current
     * crush data, use the latest version of that
     * data so newly revealed information appears.
     */

    const liveCrush =

        typeof SC_Mutual_FindCrush === "function"

            ?

            SC_Mutual_FindCrush(
                person.id
            )

            :

            null;


    const profilePerson =

        SC_ProfileNetwork_NormalizePerson({

            ...person,

            ...(liveCrush || {})

        });


    renderMutualProfileContent(
        profilePerson,
        {
            mode:"following"
        }
    );


    if(mutualProfileView){

        mutualProfileView.classList.add(
            "active"
        );

        mutualProfileView.setAttribute(
            "aria-hidden",
            "false"
        );

    }

}

function openFollowerProfile(person){

    if(!person){
        return;
    }


    closeProfileNetworkList();


    /*
     * Use the latest crush/reveal information
     * when it is available.
     */

    const liveCrush =

        typeof SC_Mutual_FindCrush === "function"

            ?

            SC_Mutual_FindCrush(
                person.id
            )

            :

            null;


    const profilePerson =

        SC_ProfileNetwork_NormalizePerson({

            ...person,

            ...(liveCrush || {})

        });


    renderMutualProfileContent(
        profilePerson,
        {

            mode:

                SC_ProfileNetwork_IsFollowing(
                    person.id
                )

                    ?

                    "following"

                    :

                    "follower"

        }
    );


    if(mutualProfileView){

        mutualProfileView.classList.add(
            "active"
        );

        mutualProfileView.setAttribute(
            "aria-hidden",
            "false"
        );

    }

}



if(profileFollowingViewAll){

    profileFollowingViewAll.addEventListener(
        "click",
        () =>
            openProfileNetworkList(
                "following"
            )
    );

}


if(profileFollowersViewAll){

    profileFollowersViewAll.addEventListener(
        "click",
        () =>
            openProfileNetworkList(
                "followers"
            )
    );

}

/* =====================================================
MODULE: PROFILE — EDIT ELEMENT REFERENCES
===================================================== */

const editProfileButton=
    document.getElementById("edit-profile-button");

const profileEditPanel=
    document.getElementById("profile-edit-panel");

const cancelProfileEdit=
    document.getElementById("cancel-profile-edit");

const saveProfileChanges=
    document.getElementById("save-profile-changes");

const editProfilePicture=
    document.getElementById("edit-profile-picture");

const editProfilePreview=
    document.getElementById("edit-profile-preview");

const editProfileName=
    document.getElementById("edit-profile-name");

const editInstitution=
    document.getElementById("edit-institution");

const editFaculty=
    document.getElementById("edit-faculty");

const editStudyYear=
    document.getElementById("edit-study-year");

const editGender=
    document.getElementById("edit-gender");


/* =====================================================
MODULE: PROFILE — OPEN EDIT MODE
===================================================== */

if(editProfileButton){

    editProfileButton.addEventListener("click",()=>{

        const savedProfile=
            localStorage.getItem("secretCrushProfile");

        if(!savedProfile){
            return;
        }

        let profile;

        try{

            profile=JSON.parse(savedProfile);

        }catch(error){

            console.error(
                "Unable to load profile for editing:",
                error
            );

            return;
        }


        /* Fill form with current data */

        if(editProfileName){
            editProfileName.value=
                profile.name || "";
        }

        if(editInstitution){
            editInstitution.value=
                profile.institution || "";
        }

        if(editFaculty){
            editFaculty.value=
                profile.faculty || "";
        }

        if(editStudyYear){
            editStudyYear.value=
                profile.year || "";
        }

        if(editGender){
            editGender.value=
                profile.gender || "";
        }


        /* Current profile picture */

        if(
            editProfilePreview &&
            profile.profilePicture
        ){

            editProfilePreview.src=
                profile.profilePicture;

        }


        /* Open panel */

        profileEditPanel.classList.add("active");

        setTimeout(()=>{

            profileEditPanel.scrollIntoView({
                behavior:"smooth",
                block:"start"
            });

        },100);

    });

}


/* =====================================================
MODULE: PROFILE — CANCEL EDITING
===================================================== */

if(cancelProfileEdit){

    cancelProfileEdit.addEventListener("click",()=>{

        profileEditPanel.classList.remove("active");

        profilePage.scrollTop=
            profilePage.scrollTop;

    });

}


/* =====================================================
MODULE: PROFILE — CHANGE PROFILE PICTURE
===================================================== */

if(editProfilePicture){

    editProfilePicture.addEventListener("change",()=>{

        const file=
            editProfilePicture.files[0];

        if(!file){
            return;
        }


        if(!file.type.startsWith("image/")){

            alert("Please select an image.");

            editProfilePicture.value="";

            return;
        }


        const reader=
            new FileReader();


        reader.onload=(event)=>{

            if(editProfilePreview){

                editProfilePreview.src=
                    event.target.result;

            }

        };


        reader.readAsDataURL(file);

    });

}


/* =====================================================
MODULE: PROFILE — SAVE CHANGES
===================================================== */

if(saveProfileChanges){

    saveProfileChanges.addEventListener("click",()=>{

        const savedProfile=
            localStorage.getItem("secretCrushProfile");

        if(!savedProfile){

            alert("Your profile could not be found.");

            return;
        }


        let profile;

        try{

            profile=
                JSON.parse(savedProfile);

        }catch(error){

            alert(
                "There was a problem loading your profile."
            );

            return;
        }


        /* Validate name */

        const newName=
            editProfileName.value.trim();

        if(!newName){

            alert("Please enter your profile name.");

            editProfileName.focus();

            return;
        }


        /* Update profile information */

        profile.name=
            newName;

        profile.institution=
            editInstitution.value;

        profile.faculty=
            editFaculty.value;

        profile.year=
            editStudyYear.value;

        profile.gender=
            editGender.value;


        /* Update picture only if a new one was selected */

        if(
            editProfilePreview &&
            editProfilePreview.src
        ){

            profile.profilePicture=
                editProfilePreview.src;

        }

/* Save updated profile */

profile.updatedAt =
    new Date().toISOString();


localStorage.setItem(
    "secretCrushProfile",
    JSON.stringify(profile)
);


/*
 * IMPORTANT:
 * Do not manually refresh only one or two
 * screens.
 *
 * Refresh the entire profile-dependent
 * interface system.
 */

SC_ProfileSync_RefreshAll();



        /* Close editing panel */
        

        profileEditPanel.classList.remove("active");


        /* Scroll back to top */

        profilePage.scrollTop=0;


        showSCMessage({

    type:"SUCCESS",

    icon:"♡",

    title:"Profile Updated",

    message:
        "Your profile information has been updated successfully.",

    buttonText:"Done"

});

    });
    
}

/* =====================================================
MODULE: PROFILE — CHANGE INTERESTS
===================================================== */

const changeInterestButton =
    document.getElementById("change-interest-button");

const changeInterestPanel =
    document.getElementById("change-interest-panel");

const cancelInterestChange =
    document.getElementById("cancel-interest-change");

const saveInterestChanges =
    document.getElementById("save-interest-changes");

const changeInterestOptions =
    document.querySelectorAll(".change-interest-option");

const changeInterestCount =
    document.getElementById("change-interest-count");


let selectedProfileInterests = [];


/* =====================================================
MODULE: CHANGE INTERESTS — OPEN PANEL
===================================================== */

if(changeInterestButton){

    changeInterestButton.addEventListener("click",()=>{

        const savedProfile =
            localStorage.getItem("secretCrushProfile");

        if(!savedProfile){

            alert("Your profile could not be found.");

            return;
        }


        let profile;

        try{

            profile =
                JSON.parse(savedProfile);

        }catch(error){

            console.error(
                "Unable to load profile:",
                error
            );

            return;
        }


        /*
        Start with the user's
        current interests.
        */

        selectedProfileInterests =
            Array.isArray(profile.interests)
                ? [...profile.interests]
                : [];


        /*
        Reset all buttons first.
        */

        changeInterestOptions.forEach(option=>{

            const interest =
                option.dataset.interest;

            option.classList.toggle(
                "selected",
                selectedProfileInterests.includes(interest)
            );

        });


        /*
        Update counter.
        */

        if(changeInterestCount){

            changeInterestCount.textContent =
                selectedProfileInterests.length;

        }


        /*
        Enable save only when
        exactly 5 interests exist.
        */

        if(saveInterestChanges){

            saveInterestChanges.disabled =
                selectedProfileInterests.length !== 5;

        }


        /*
        Open panel.
        */

        if(changeInterestPanel){

            changeInterestPanel.classList.add("active");

            setTimeout(()=>{

                changeInterestPanel.scrollIntoView({
                    behavior:"smooth",
                    block:"start"
                });

            },100);

        }

    });

}


/* =====================================================
MODULE: CHANGE INTERESTS — SELECT OPTIONS
===================================================== */

changeInterestOptions.forEach(option=>{

    option.addEventListener("click",()=>{

        const interest =
            option.dataset.interest;


        /*
        Remove interest
        if already selected.
        */

        if(
            selectedProfileInterests.includes(interest)
        ){

            selectedProfileInterests =
                selectedProfileInterests.filter(
                    item => item !== interest
                );

            option.classList.remove("selected");

        }


        /*
        Add interest if
        fewer than 5 are selected.
        */

        else{

            if(
                selectedProfileInterests.length >= 5
            ){

                return;
            }


            selectedProfileInterests.push(
                interest
            );

            option.classList.add("selected");

        }


        /*
        Update counter.
        */

        if(changeInterestCount){

            changeInterestCount.textContent =
                selectedProfileInterests.length;

        }


        /*
        Enable save only
        at exactly 5.
        */

        if(saveInterestChanges){

            saveInterestChanges.disabled =
                selectedProfileInterests.length !== 5;

        }

    });

});


/* =====================================================
MODULE: CHANGE INTERESTS — CANCEL
===================================================== */

if(cancelInterestChange){

    cancelInterestChange.addEventListener("click",()=>{

        if(changeInterestPanel){

            changeInterestPanel.classList.remove(
                "active"
            );

        }

    });

}


/* =====================================================
MODULE: CHANGE INTERESTS — SAVE
===================================================== */

if(saveInterestChanges){

    saveInterestChanges.addEventListener("click",()=>{

        /*
        Make sure exactly 5 interests
        have been selected.
        */

        if(
            selectedProfileInterests.length !== 5
        ){

            alert(
                "Please select exactly 5 interests."
            );

            return;
        }


        const savedProfile =
            localStorage.getItem(
                "secretCrushProfile"
            );


        if(!savedProfile){

            alert(
                "Your profile could not be found."
            );

            return;
        }


        let profile;

        try{

            profile =
                JSON.parse(savedProfile);

        }catch(error){

            console.error(
                "Unable to load profile:",
                error
            );

            alert(
                "There was a problem loading your profile."
            );

            return;
        }


        /*
        Replace the old interests
        with the new ones.
        */

        profile.interests =
            [...selectedProfileInterests];


        /*
        Save the updated profile.
        */

profile.updatedAt =
    new Date().toISOString();


localStorage.setItem(
    "secretCrushProfile",
    JSON.stringify(profile)
);


/*
 * Interests are part of the canonical profile.
 * Refresh every interface that can display them.
 */

SC_ProfileSync_RefreshAll();


        /*
        Close the panel.
        */

        if(changeInterestPanel){

            changeInterestPanel.classList.remove(
                "active"
            );

        }


        /*
        Scroll back to the top
        of the profile page.
        */

        profilePage.scrollTop = 0;


        alert(
            "Your interests have been updated."
        );

    });

}


/* =====================================================
MODULE: SETTINGS — DEFAULTS
===================================================== */

const defaultSettings={

    notifications:true,

    newCrush:true,

    secretNotes:true,

    mutualCrush:true,

    messages:true,

    showIntro:true,

    animations:true,

    sounds:true,

    theme:"dark",

    accent:"violet"

};


/* =====================================================
MODULE: SETTINGS — LOAD
===================================================== */

function getSettings(){

    const saved=
        localStorage.getItem(
            "secretCrushSettings"
        );

    if(!saved){

        return {
            ...defaultSettings
        };

    }

    try{

        return {
            ...defaultSettings,
            ...JSON.parse(saved)
        };

    }catch(error){

        console.error(
            "Unable to load settings:",
            error
        );

        return {
            ...defaultSettings
        };

    }

}


/* =====================================================
MODULE: SETTINGS — SAVE
===================================================== */

function saveSettings(settings){

    localStorage.setItem(
        "secretCrushSettings",
        JSON.stringify(settings)
    );

}


/* =====================================================
MODULE: SETTINGS — ELEMENTS
===================================================== */

const settingNotifications=
    document.getElementById(
        "setting-notifications"
    );

const settingNewCrush=
    document.getElementById(
        "setting-new-crush"
    );

const settingSecretNotes=
    document.getElementById(
        "setting-secret-notes"
    );

const settingMutualCrush=
    document.getElementById(
        "setting-mutual-crush"
    );

const settingMessages=
    document.getElementById(
        "setting-messages"
    );

const settingShowIntro=
    document.getElementById(
        "setting-show-intro"
    );

const settingAnimations=
    document.getElementById(
        "setting-animations"
    );

const settingSounds=
    document.getElementById(
        "setting-sounds"
    );

const themeOptions=
    document.querySelectorAll(
        ".theme-option"
    );

const accentOptions=
    document.querySelectorAll(
        ".accent-option"
    );

const settingsLogoutButton=
    document.getElementById(
        "settings-logout-button"
    );

const createPasswordButton=
    document.getElementById(
        "create-password-button"
    );

const changePasswordButton=
    document.getElementById(
        "change-password-button"
    );


/* =====================================================
MODULE: SETTINGS — LOAD INTO UI
===================================================== */

function loadSettings(){

    const settings=
        getSettings();


    if(settingNotifications){
        settingNotifications.checked=
            settings.notifications;
    }

    if(settingNewCrush){
        settingNewCrush.checked=
            settings.newCrush;
    }

    if(settingSecretNotes){
        settingSecretNotes.checked=
            settings.secretNotes;
    }

    if(settingMutualCrush){
        settingMutualCrush.checked=
            settings.mutualCrush;
    }

    if(settingMessages){
        settingMessages.checked=
            settings.messages;
    }

    if(settingShowIntro){
        settingShowIntro.checked=
            settings.showIntro;
    }

    if(settingAnimations){
        settingAnimations.checked=
            settings.animations;
    }

    if(settingSounds){
        settingSounds.checked=
            settings.sounds;
    }


    themeOptions.forEach(option=>{

        option.classList.toggle(
            "active",
            option.dataset.theme===
            settings.theme
        );

    });


    accentOptions.forEach(option=>{

        option.classList.toggle(
            "active",
            option.dataset.accent===
            settings.accent
        );

    });


    applyTheme(
        settings.theme
    );

    applyAccent(
        settings.accent
    );

}


/* =====================================================
MODULE: SETTINGS — MASTER NOTIFICATIONS
===================================================== */

function updateNotificationChildren(
    enabled
){

    if(settingNewCrush){
        settingNewCrush.checked=
            enabled;
    }

    if(settingSecretNotes){
        settingSecretNotes.checked=
            enabled;
    }

    if(settingMutualCrush){
        settingMutualCrush.checked=
            enabled;
    }

    if(settingMessages){
        settingMessages.checked=
            enabled;
    }

}


/* =====================================================
MASTER NOTIFICATIONS
===================================================== */

if(settingNotifications){

    settingNotifications.addEventListener(
        "change",
        ()=>{

            const settings=
                getSettings();

            settings.notifications=
                settingNotifications.checked;


            updateNotificationChildren(
                settingNotifications.checked
            );


            settings.newCrush=
                settingNotifications.checked;

            settings.secretNotes=
                settingNotifications.checked;

            settings.mutualCrush=
                settingNotifications.checked;

            settings.messages=
                settingNotifications.checked;


            saveSettings(settings);

        }
    );

}


/* =====================================================
INDIVIDUAL NOTIFICATIONS
===================================================== */

function setupNotificationSetting(
    element,
    property
){

    if(!element){
        return;
    }


    element.addEventListener(
        "change",
        ()=>{

            const settings=
                getSettings();

            settings[property]=
                element.checked;


            /*
            Master notifications remain
            ON if at least one notification
            type is enabled.
            */

            settings.notifications=
                settings.newCrush ||
                settings.secretNotes ||
                settings.mutualCrush ||
                settings.messages;


            if(settingNotifications){

                settingNotifications.checked=
                    settings.notifications;

            }


            saveSettings(settings);

        }
    );

}


setupNotificationSetting(
    settingNewCrush,
    "newCrush"
);

setupNotificationSetting(
    settingSecretNotes,
    "secretNotes"
);

setupNotificationSetting(
    settingMutualCrush,
    "mutualCrush"
);

setupNotificationSetting(
    settingMessages,
    "messages"
);


/* =====================================================
APP EXPERIENCE
===================================================== */

if(settingShowIntro){

    settingShowIntro.addEventListener(
        "change",
        ()=>{

            const settings=
                getSettings();

            settings.showIntro=
                settingShowIntro.checked;

            saveSettings(settings);

        }
    );

}


if(settingAnimations){

    settingAnimations.addEventListener(
        "change",
        ()=>{

            const settings=
                getSettings();

            settings.animations=
                settingAnimations.checked;

            saveSettings(settings);

            document.documentElement.classList.toggle(
                "animations-disabled",
                !settings.animations
            );

        }
    );

}


if(settingSounds){

    settingSounds.addEventListener(
        "change",
        ()=>{

            const settings=
                getSettings();

            settings.sounds=
                settingSounds.checked;

            saveSettings(settings);

        }
    );

}


/* =====================================================
THEME
===================================================== */

function applyTheme(theme){

    document.documentElement.dataset.theme=
        theme;

}


themeOptions.forEach(option=>{

    option.addEventListener(
        "click",
        ()=>{

            const theme=
                option.dataset.theme;


            const settings=
                getSettings();

            settings.theme=
                theme;

            saveSettings(settings);


            themeOptions.forEach(item=>{

                item.classList.remove(
                    "active"
                );

            });

            option.classList.add(
                "active"
            );


            applyTheme(theme);

        }
    );

});


/* =====================================================
ACCENT COLOR
===================================================== */
function applyAccent(accent){

    document.documentElement.dataset.accent=
        accent;

}


accentOptions.forEach(option=>{

    option.addEventListener(
        "click",
        ()=>{

            const accent=
                option.dataset.accent;


            const settings=
                getSettings();

            settings.accent=
                accent;

            saveSettings(settings);


            accentOptions.forEach(item=>{

                item.classList.remove(
                    "active"
                );

            });

            option.classList.add(
                "active"
            );


            applyAccent(accent);

        }
    );

});



/* =====================================================
MODULE: SETTINGS — LOG OUT
===================================================== */

if(settingsLogoutButton){

    settingsLogoutButton.addEventListener(
        "click",
        ()=>{

            const confirmLogout=
                confirm(
                    "Are you sure you want to log out?"
                );


            if(!confirmLogout){
                return;
            }


            localStorage.removeItem(
                "secretCrushSession"
            );

            localStorage.removeItem(
                "secretCrushProfile"
            );


            hideAppNavigation();


            document.querySelectorAll(
                ".app-page"
            ).forEach(page=>{

                page.classList.remove(
                    "active"
                );

            });


            registrationPage.classList.add(
                "active"
            );


            setActiveNavigation("home");

        }
    );

}


/* =====================================================
MODULE: SETTINGS — PASSWORD PLACEHOLDER
===================================================== */

if(createPasswordButton){

    createPasswordButton.addEventListener(
        "click",
        ()=>{

            alert(
                "Password protection will be connected to your secure account system when the backend is added."
            );

        }
    );

}


if(changePasswordButton){

    changePasswordButton.addEventListener(
        "click",
        ()=>{

            alert(
                "Password management will be available once secure account authentication is connected."
            );

        }
    );

}


/* =====================================================
MODULE: SETTINGS — INITIALIZE
===================================================== */

loadSettings();



/* =====================================================
MODULE: BANK — CONFIGURATION
===================================================== */

const BANK_CONFIG = {

    /*
     * These are provisional prices.
     * We can change them later without
     * redesigning the Bank page.
     */

    newGameCost: 20,

    redoGameCost: 10,


    /*
     * Standard coin packages.
     *
     * Current structure:
     * 100 coins = KSh 50
     * 150 coins = KSh 75
     * 200 coins = KSh 100
     * etc.
     */

    coinPackages: [
        {
            coins: 100,
            price: 50
        },

        {
            coins: 150,
            price: 75
        },

        {
            coins: 200,
            price: 100
        },

        {
            coins: 250,
            price: 125
        },

        {
            coins: 300,
            price: 150
        },

        {
            coins: 350,
            price: 175
        }
    ],


    /*
     * One-time deals.
     *
     * These are intentionally kept separate
     * because we expect to adjust them later.
     */

    oneTimeDeals: [
        {
            coins: 50,
            price: 20,
            normalPrice: 25,
            icon: "✨"
        },

        {
            coins: 100,
            price: 35,
            normalPrice: 50,
            icon: "💜"
        },

        {
            coins: 150,
            price: 55,
            normalPrice: 75,
            icon: "💎"
        },

        {
            coins: 250,
            price: 90,
            normalPrice: 125,
            icon: "🔥"
        }
    ]

};


/* =====================================================
MODULE: BANK — COIN BALANCE
===================================================== */

/*
 * For now this reads the balance from localStorage.
 *
 * Later this can be replaced with the real
 * database balance without changing the UI.
 */

/* =====================================================
   SECRET CRUSH — CENTRAL COIN / REWARD SYSTEM
   ===================================================== */

const SC_COINS_KEY = "secretCrushCoins";
const SC_FREE_GAMES_KEY = "secretCrushFreeGames";
const SC_REWARDS_KEY = "secretCrushRewardTransactions";
const SC_SPENDING_KEY = "secretCrushSpendingTransactions";

/* =====================================================
   GET CURRENT COIN BALANCE
   ===================================================== */

function getBankCoinBalance(){

    const storedBankCoins =
        localStorage.getItem(SC_COINS_KEY);

    const savedProfile =
        localStorage.getItem("secretCrushProfile");

    let bankCoins =
        Number(storedBankCoins);

    let profileCoins = 0;

    if(savedProfile){

        try{

            const profile =
                JSON.parse(savedProfile);

            profileCoins =
                Number(profile.coins) || 0;

        }catch(error){

            profileCoins = 0;

        }

    }


    /*
     * FIRST-TIME MIGRATION
     *
     * If the old profile system contains a balance
     * but the Bank does not, preserve the existing
     * balance instead of resetting it.
     *
     * If both systems contain values, use the higher
     * existing value so we do not accidentally erase
     * the user's current demo balance.
     */

    if(
        !Number.isFinite(bankCoins) ||
        bankCoins < 0
    ){

        bankCoins = 0;

    }


    if(
        bankCoins === 0 &&
        profileCoins > 0
    ){

        bankCoins = profileCoins;

        localStorage.setItem(
            SC_COINS_KEY,
            String(bankCoins)
        );

    }


    return bankCoins;

}


/* =====================================================
   GET FREE GAME BALANCE
   ===================================================== */

function getFreeGameBalance(){

    const stored =
        Number(
            localStorage.getItem(
                SC_FREE_GAMES_KEY
            )
        );

    return Number.isFinite(stored)
        ? Math.max(0, stored)
        : 0;

}

/* =====================================================
   GAME BANK — UPDATE ALL GAME BALANCE DISPLAYS
   ===================================================== */

function updateAllGameBalanceDisplays(){

    const balance =
        getFreeGameBalance();


    /*
     * Main Bank games balance
     */

    const bankGames =
        document.getElementById(
            "app-bank-games"
        );

    if(bankGames){

        bankGames.textContent =
            balance.toLocaleString();

    }


    /*
     * Guess My Crush games available
     */

    const guessGames =
        document.getElementById(
            "guess-my-crush-game-balance"
        );

    if(guessGames){

        guessGames.textContent =
            balance.toLocaleString();

    }

}
/* =====================================================
   GAME BANK — SPEND ONE GAME
   ===================================================== */

function spendSecretCrushGame(
    title = "Guess My Crush — Game"
){

    const currentGames =
        getFreeGameBalance();


    /*
     * Never allow the balance to go below zero.
     */

    if(currentGames < 1){

        return false;

    }


    const newGameBalance =
        currentGames - 1;


    /*
     * Save the new Game Bank balance.
     */

    localStorage.setItem(
        SC_FREE_GAMES_KEY,
        String(newGameBalance)
    );


    /*
     * Record the expenditure.
     *
     * The existing spending-history system stores
     * positive amounts and displays the minus sign,
     * so amount = 1 here.
     */

    recordAppSpend({

        title:
            title,

        amount:
            1

    });


    /*
     * Refresh every visible Game Bank display.
     */

    updateAllGameBalanceDisplays();


    return true;

}


/* =====================================================
   SAVE PROFILE COIN BALANCE
   ===================================================== */

function syncProfileCoinBalance(balance){

    const savedProfile =
        localStorage.getItem(
            "secretCrushProfile"
        );

    if(!savedProfile){
        return;
    }

    try{

        const profile =
            JSON.parse(savedProfile);

        profile.coins =
            balance;

        localStorage.setItem(
            "secretCrushProfile",
            JSON.stringify(profile)
        );

    }catch(error){

        console.warn(
            "Could not sync profile coin balance:",
            error
        );

    }

}


/* =====================================================
   UPDATE EVERY VISIBLE COIN BALANCE
   ===================================================== */

function updateAllCoinDisplays(){

    const balance =
        getBankCoinBalance();


    /*
     * Bank
     */

    const bankBalance =
        document.getElementById(
            "bank-coin-balance"
        );

    if(bankBalance){

        bankBalance.textContent =
            balance.toLocaleString();

    }


    /*
     * Homepage
     */

    const homeBalance =
        document.getElementById(
            "coin-count"
        );

    if(homeBalance){

        homeBalance.textContent =
            balance.toLocaleString();

    }


    /*
     * Other existing coin displays
     */

    document
        .querySelectorAll(
            "[data-secret-crush-coin-balance]"
        )
        .forEach(element => {

            element.textContent =
                balance.toLocaleString();

        });

}


/* =====================================================
   LOAD REWARD TRANSACTIONS
   ===================================================== */

function getRewardTransactions(){

    try{

        const stored =
            JSON.parse(
                localStorage.getItem(
                    SC_REWARDS_KEY
                ) || "[]"
            );

        return Array.isArray(stored)
            ? stored
            : [];

    }catch(error){

        console.warn(
            "Could not load reward transactions:",
            error
        );

        return [];

    }

}


/* =====================================================
   SAVE REWARD TRANSACTION
   ===================================================== */

function saveRewardTransaction(transaction){

    const transactions =
        getRewardTransactions();

    transactions.unshift(
        transaction
    );


    /*
     * Keep the ledger small for now because
     * localStorage has limited capacity.
     */

    const limitedTransactions =
        transactions.slice(0, 100);


    localStorage.setItem(
        SC_REWARDS_KEY,
        JSON.stringify(
            limitedTransactions
        )
    );

}


/* =====================================================
   AWARD COINS
   ===================================================== */

function awardSecretCrushCoins(
    amount,
    reason = "Reward"
){

    amount =
        Number(amount);


    if(
        !Number.isFinite(amount) ||
        amount <= 0
    ){

        return false;

    }


    const currentBalance =
        getBankCoinBalance();


    const newBalance =
        currentBalance + amount;


    /*
     * ONE canonical balance.
     */

    localStorage.setItem(
        SC_COINS_KEY,
        String(newBalance)
    );


    /*
     * Keep old profile data synchronized
     * while the app is still using localStorage.
     */

    syncProfileCoinBalance(
        newBalance
    );


    /*
     * Record the reward.
     */

    saveRewardTransaction({

        id:
            "reward-" +
            Date.now(),

        type:
            "coin",

        amount:
            amount,

        reason:
            reason,

        balanceAfter:
            newBalance,

        createdAt:
            Date.now()

    });

    updateAllGameBalanceDisplays();

    return true;
    /*
     * Immediately refresh every visible balance.
     */

    updateAllCoinDisplays();


    return true;

}


/* =====================================================
   AWARD FREE GAMES
   ===================================================== */

function awardSecretCrushFreeGames(
    amount,
    reason = "Reward"
){

    amount =
        Number(amount);


    if(
        !Number.isFinite(amount) ||
        amount <= 0
    ){

        return false;

    }


    const currentGames =
        getFreeGameBalance();


    const newGameBalance =
        currentGames + amount;


    localStorage.setItem(
        SC_FREE_GAMES_KEY,
        String(newGameBalance)
    );


    saveRewardTransaction({

        id:
            "reward-game-" +
            Date.now(),

        type:
            "free-game",

        amount:
            amount,

        reason:
            reason,

        balanceAfter:
            newGameBalance,

        createdAt:
            Date.now()

    });


    return true;

}


/* =====================================================
   CENTRAL REWARD FUNCTION
   ===================================================== */

function awardSecretCrushReward({

    coins = 0,

    freeGames = 0,

    reason = "Secret Crush Reward"

}){

    let awardedSomething =
        false;


    if(coins > 0){

        awardedSomething =
            awardSecretCrushCoins(
                coins,
                reason
            ) ||
            awardedSomething;

    }


    if(freeGames > 0){

        awardedSomething =
            awardSecretCrushFreeGames(
                freeGames,
                reason
            ) ||
            awardedSomething;

    }


    return awardedSomething;

}

/* =====================================================
   APP REWARD TRANSACTION LEDGER
   ===================================================== */

const APP_REWARD_TRANSACTIONS_KEY =
    "secretCrushRewardTransactions";


/* =====================================================
   LOAD REWARD TRANSACTIONS
   ===================================================== */

function getAppRewardTransactions(){

    try{

        const saved =
            localStorage.getItem(
                APP_REWARD_TRANSACTIONS_KEY
            );

        if(!saved){
            return [];
        }

        const parsed =
            JSON.parse(saved);

        return Array.isArray(parsed)
            ? parsed
            : [];

    }catch(error){

        console.warn(
            "Could not load reward transactions:",
            error
        );

        return [];

    }

}


/* =====================================================
   SAVE REWARD TRANSACTIONS
   ===================================================== */

function saveAppRewardTransactions(
    transactions
){

    try{

        /*
         * Keep only the latest 100 records.
         *
         * Reward records are deliberately kept small
         * because localStorage has limited capacity.
         */

        const limited =
            transactions.slice(0,100);

        localStorage.setItem(
            APP_REWARD_TRANSACTIONS_KEY,
            JSON.stringify(limited)
        );

        return true;

    }catch(error){

        console.warn(
            "Could not save reward transactions:",
            error
        );

        return false;

    }

}


/* =====================================================
   RECORD A REWARD
   ===================================================== */

function recordAppReward({

    type = "reward",

    title = "Reward Received",

    description = "",

    coins = 0,

    games = 0

} = {}){

    const transactions =
        getAppRewardTransactions();


    const transaction = {

        id:
            "reward-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2,8),

        type:

            type,

        title:

            title,

        description:

            description,

        coins:

            Number(coins) || 0,

        games:

            Number(games) || 0,

        createdAt:

            Date.now()

    };


    transactions.unshift(
        transaction
    );


    saveAppRewardTransactions(
        transactions
    );


    /*
     * Refresh the App Transactions interface
     * immediately if it is currently visible.
     */
if(
        typeof renderAppRewardTransactions ===
        "function"
    ){

        renderAppRewardTransactions();

    }


    return transaction;

}


/* =====================================================
   RECORD COIN REWARD
   ===================================================== */

function recordCoinReward(
    amount,
    title,
    description = ""
){

    return recordAppReward({

        type:
            "coin-reward",

        title:
            title,

        description:
            description,

        coins:
            amount,

        games:
            0

    });

}


/* =====================================================
   RECORD FREE GAME REWARD
   ===================================================== */

function recordGameReward(
    amount,
    title,
    description = ""
){

    return recordAppReward({

        type:
            "game-reward",

        title:
            title,

        description:
            description,

        coins:
            0,

        games:
            amount

    });

}


/* =====================================================
   UPDATE BANK BALANCE
   ===================================================== */

function updateBankBalance(){

    updateAllCoinDisplays();

}



/* =====================================================
BANK — LOAD CONFIGURED PRICES
===================================================== */

function loadBankPrices(){

    const newGameCost =
        document.getElementById(
            "new-game-cost"
        );

    const redoGameCost =
        document.getElementById(
            "redo-game-cost"
        );


    if(newGameCost){

        newGameCost.textContent =
            BANK_CONFIG.newGameCost;

    }


    if(redoGameCost){

        redoGameCost.textContent =
            BANK_CONFIG.redoGameCost;

    }

}


/* =====================================================
BANK — GENERATE COIN PACKAGES
===================================================== */

function renderCoinPackages(){

    const container =
        document.getElementById(
            "coin-packages"
        );

    if(!container){

        return;

    }


    container.innerHTML = "";


    BANK_CONFIG.coinPackages.forEach(
        packageData => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "coin-package";


            button.innerHTML = `

                <div class="coin-package-coins">

                    <span>🪙</span>

                    <strong>
                        ${packageData.coins}
                    </strong>

                </div>

                <div class="coin-package-price">

                    KSh ${packageData.price}

                </div>

            `;


            button.addEventListener(
                "click",
                () => {

                    purchaseCoinPackage(
                        packageData
                    );

                }
            );


            container.appendChild(button);

        }
    );

}


/* =====================================================
BANK — GENERATE ONE TIME DEALS
===================================================== */

function renderOneTimeDeals(){

    const container =
        document.getElementById(
            "one-time-deals-list"
        );

    if(!container){

        return;

    }


    container.innerHTML = "";


    BANK_CONFIG.oneTimeDeals.forEach(
        deal => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "one-time-deal";


            button.innerHTML = `

                <div class="one-time-deal-icon">

                    ${deal.icon}

                </div>


                <div class="one-time-deal-info">

                    <strong>
                        ${deal.coins} Coins
                    </strong>

                    <small>
                        One-time coin offer
                    </small>

                </div>


                <div class="one-time-deal-price">

                    <span
                        class="one-time-deal-old-price"
                    >
                        KSh ${deal.normalPrice}
                    </span>

                    <strong
                        class="one-time-deal-current-price"
                    >
                        KSh ${deal.price}
                    </strong>

                </div>

            `;


            button.addEventListener(
                "click",
                () => {

                    purchaseOneTimeDeal(
                        deal
                    );

                }
            );


            container.appendChild(button);

        }
    );

}


/* =====================================================
BANK — ONE TIME DEALS OVERLAY
===================================================== */

function openOneTimeDeals(){

    const overlay =
        document.getElementById(
            "one-time-deals-overlay"
        );

    if(!overlay){

        return;

    }

    overlay.classList.add("active");

    document.body.style.overflow =
        "hidden";

}


function closeOneTimeDeals(){

    const overlay =
        document.getElementById(
            "one-time-deals-overlay"
        );

    if(!overlay){

        return;

    }

    overlay.classList.remove("active");

    document.body.style.overflow =
        "";

}


/* =====================================================
BANK — PURCHASE PLACEHOLDERS
===================================================== */

/*
 * These currently only demonstrate the interaction.
 *
 * We are NOT pretending that payment is functional yet.
 *
 * Later this is where M-PESA/payment processing will go.
 */

function purchaseCoinPackage(packageData){

    console.log(
        "Coin package selected:",
        packageData
    );


    alert(
        `${packageData.coins} coins for KSh ${packageData.price} selected.`
    );

}


function purchaseOneTimeDeal(deal){

    console.log(
        "One-time deal selected:",
        deal
    );


    alert(
        `${deal.coins} coins for KSh ${deal.price} selected.`
    );

}


/* =====================================================
BANK — GAME PURCHASE ACTIONS
===================================================== */

function useBankItem(cost, actionName){

    const balance =
        getBankCoinBalance();


    if(balance < cost){

        alert(
            `You need ${cost} coins to ${actionName}.`
        );

        return false;

    }


    /*
     * We are not deducting the coins yet.
     *
     * The actual game/payment economy will be
     * connected once the game system is implemented.
     */

    console.log(
        `${actionName} requested for ${cost} coins.`
    );

    return true;

}


/* =====================================================
BANK — INITIALIZATION
===================================================== */

function initializeBankPage(){

    updateBankBalance();

    loadBankPrices();

    renderCoinPackages();

    renderOneTimeDeals();


    /* ONE TIME DEALS OPEN */

    const dealsButton =
        document.getElementById(
            "one-time-deals-button"
        );

    if(dealsButton){

        dealsButton.addEventListener(
            "click",
            openOneTimeDeals
        );

    }


    /* ONE TIME DEALS CLOSE */

    const closeDealsButton =
        document.getElementById(
            "close-deals-button"
        );

    if(closeDealsButton){

        closeDealsButton.addEventListener(
            "click",
            closeOneTimeDeals
        );

    }


    /* BACKDROP CLOSE */

    const backdrop =
        document.querySelector(
            ".one-time-deals-backdrop"
        );

    if(backdrop){

        backdrop.addEventListener(
            "click",
            closeOneTimeDeals
        );

    }


    /* ESCAPE CLOSE */

    document.addEventListener(
        "keydown",
        event => {

            if(
                event.key === "Escape"
            ){

                closeOneTimeDeals();

            }

        }
    );


    /* NEW GAME */

    const newGameButton =
        document.getElementById(
            "bank-new-game-button"
        );

    if(newGameButton){

        newGameButton.addEventListener(
            "click",
            () => {

                useBankItem(
                    BANK_CONFIG.newGameCost,
                    "start a new crush game"
                );

            }
        );

    }


    /* REDO GAME */

    const redoGameButton =
        document.getElementById(
            "bank-redo-game-button"
        );

    if(redoGameButton){

        redoGameButton.addEventListener(
            "click",
            () => {

                useBankItem(
                    BANK_CONFIG.redoGameCost,
                    "redo the game"
                );

            }
        );

    }

}


/* =====================================================
BANK — START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeBankPage
);


/* =====================================================
MODULE: HOME — SIDE MENU
===================================================== */

function openSideMenu(){

    if(!sideMenu || !sideMenuBackdrop){
        return;
    }

    sideMenu.classList.add("active");

    sideMenuBackdrop.classList.add("active");

    document.body.classList.add("side-menu-open");

}


function closeSideMenu(){

    if(!sideMenu || !sideMenuBackdrop){
        return;
    }

    sideMenu.classList.remove("active");

    sideMenuBackdrop.classList.remove("active");

    document.body.classList.remove(
        "activity-hub-open"
    );

}


/* =====================================================
MODULE: SPADE — ACTIVITY HUB UNREAD TRACKING

Single source of truth for the Activity Hub numbers.
===================================================== */

const SC_ACTIVITY_SEEN_KEY =
    "secretCrushActivitySeenIds";


function SC_Activity_LoadSeenMap(){

    try{

        const raw =
            localStorage.getItem(
                SC_ACTIVITY_SEEN_KEY
            );

        return raw ? JSON.parse(raw) : {};

    }catch(e){

        return {};

    }

}


function SC_Activity_SaveSeenMap(map){

    localStorage.setItem(
        SC_ACTIVITY_SEEN_KEY,
        JSON.stringify(map)
    );

}


function SC_Activity_GetUnseenIds(category, allIds){

    const map =
        SC_Activity_LoadSeenMap();

    const seen =
        map[category] || [];

    return allIds.filter(
        id => !seen.includes(id)
    );

}


function SC_Activity_MarkAllSeen(category, allIds){

    const map =
        SC_Activity_LoadSeenMap();

    map[category] =
        allIds.slice();

    SC_Activity_SaveSeenMap(map);

}


function SC_ActivityHub_SetCount(summaryClass, badgeClass, count){

    const summary =
        document.querySelector(
            `.${summaryClass} strong`
        );

    if(summary){

        summary.textContent =
            count;

    }

    document.querySelectorAll(
        `.${badgeClass}`
    ).forEach(
        badge => {

            badge.textContent =
                count;

        }
    );

}


function SC_ActivityHub_RefreshCounts(){

    if(typeof SC_DEMO_CRUSHES !== "undefined"){

        const incomingIds =
            SC_DEMO_CRUSHES.map(
                crush => crush.id
            );

        const incomingUnread =
            SC_Activity_GetUnseenIds(
                "incoming",
                incomingIds
            ).length;

        SC_ActivityHub_SetCount(
            "crush-stat",
            "crush-badge",
            incomingUnread
        );

    }

    if(typeof getMutualCrushes === "function"){

        const mutualIds =
            getMutualCrushes().map(
                crush => crush.id
            );

        const mutualUnread =
            SC_Activity_GetUnseenIds(
                "mutual",
                mutualIds
            ).length;

        SC_ActivityHub_SetCount(
            "mutual-stat",
            "mutual-badge",
            mutualUnread
        );

    }

    if(typeof updateSentCrushCounts === "function"){

        updateSentCrushCounts();

    }

    if(typeof SC_SecretNotes_UpdateCounts === "function"){

        SC_SecretNotes_UpdateCounts();

    }
    
        /*
     * GUESS MY CRUSH
     *
     * Active games are counted from the actual
     * in-progress game storage.
     */

    if(
        typeof getActiveCrushGames ===
        "function"
    ){

        const activeGameCount =
            getActiveCrushGames().length;

        SC_ActivityHub_SetCount(
            "game-stat",
            "game-badge",
            activeGameCount
        );

    }
    

}


/* =====================================================
OTHER ACTIVITY — STORAGE & EVENT ENGINE */
function returnToSideMenu(){

    /* Hide every side-menu subpage */
    document
        .querySelectorAll(".app-page")
        .forEach(page => {
            page.classList.remove("active");
        });

    /* Return to the three-dash menu */
    openSideMenu();

}


/* =====================================================
SIDE MENU — OPEN BUTTON
===================================================== */

if(menuButton){

    menuButton.addEventListener(
        "click",
        openSideMenu
    );

}


/* =====================================================
SIDE MENU — CLOSE BUTTON
===================================================== */

if(sideMenuClose){

    sideMenuClose.addEventListener(
        "click",
        closeSideMenu
    );

}


/* =====================================================
SIDE MENU — BACKDROP CLOSE
===================================================== */

if(sideMenuBackdrop){

    sideMenuBackdrop.addEventListener(
        "click",
        closeSideMenu
    );

}


/* =====================================================
SIDE MENU — ESCAPE KEY
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if(event.key === "Escape"){

            closeSideMenu();

        }

    }
);


/* =====================================================
SIDE MENU — MENU ITEMS
===================================================== */

sideMenuItems.forEach(item => {

    item.addEventListener(
        "click",
        () => {

            const destination =
                item.dataset.sideMenu;


            /* -----------------------------------------
            STREAKS
            ----------------------------------------- */

            if(destination === "streaks"){

                closeSideMenu();

                openStreaksPage();

                return;

            }


            /* -----------------------------------------
            GAME HISTORY
            ----------------------------------------- */

            if(destination === "game-history"){

                closeSideMenu();

                openGameHistoryPage();

                return;

            }
            
            /* -----------------------------------------
HELP & SUPPORT
----------------------------------------- */

if(
    destination === "help-support"
){

    closeSideMenu();

    openHelpSupportPage();

    return;

}
            /* -----------------------------------------
OTHER ACTIVITY
----------------------------------------- */

if(destination === "other-activity"){

    closeSideMenu();

    openTransactionsInterface();

    return;

}
/* -----------------------------------------
SIDEQUESTS
----------------------------------------- */

if(destination === "sidequests"){

    closeSideMenu();

    openSidequestsInterface();

    return;

}




/* -----------------------------------------
OTHER SIDE MENU ITEMS
----------------------------------------- */

closeSideMenu();


            
        }
    );

});
/* =====================================================
MODULE: STREAKS — DAILY REWARD + COUNTDOWN
===================================================== */

const STREAK_STORAGE_KEY =
    "secretCrushStreakState";
let streakCountdownInterval = null;

const STREAK_MILESTONES = [

    {
        day:7,
        reward:"5 Free Games",
        icon:"🏆"
    },

    {
        day:12,
        reward:"7 Free Games",
        icon:"🎁"
    },

    {
        day:21,
        reward:"10 Free Games",
        icon:"💎"
    },

    {
        day:30,
        reward:"15 Free Games",
        icon:"👑"
    },

    {
        day:50,
        reward:"25 Free Games",
        icon:"✨"
    }

];


/* =====================================================
LOAD STREAK DATA
===================================================== */

function getStreakState(){

    const fallback = {

        currentStreak:0,

        longestStreak:0,

        lastClaimDate:null,

        dailyClaimDay:0

    };


    try{

        return {

            ...fallback,

            ...(JSON.parse(
                localStorage.getItem(
                    STREAK_STORAGE_KEY
                )
            ) || {})

        };

    }catch(error){

        return fallback;

    }

}


/* =====================================================
SAVE STREAK DATA
===================================================== */

function saveStreakState(state){

    localStorage.setItem(

        STREAK_STORAGE_KEY,

        JSON.stringify(state)

    );

}


/* =====================================================
LOCAL DATE
===================================================== */

function localDateKey(
    date = new Date()
){

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth()+1
        ).padStart(2,"0");

    const day =
        String(
            date.getDate()
        ).padStart(2,"0");


    return `${year}-${month}-${day}`;

}


/* =====================================================
DATE DIFFERENCE
===================================================== */

function dateDifferenceInDays(a,b){

    const first =
        new Date(
            `${a}T00:00:00`
        );

    const second =
        new Date(
            `${b}T00:00:00`
        );


    return Math.round(
        (second-first) /
        86400000
    );

}


/* =====================================================
NEXT MIDNIGHT
===================================================== */

function getNextMidnight(){

    const next =
        new Date();

    next.setHours(
        24,
        0,
        0,
        0
    );

    return next;

}


/* =====================================================
FORMAT COUNTDOWN
===================================================== */

function formatCountdown(
    milliseconds
){

    const totalSeconds =
        Math.max(
            0,
            Math.floor(
                milliseconds / 1000
            )
        );


    const hours =
        String(
            Math.floor(
                totalSeconds / 3600
            )
        ).padStart(2,"0");


    const minutes =
        String(
            Math.floor(
                (totalSeconds % 3600) /
                60
            )
        ).padStart(2,"0");


    const seconds =
        String(
            totalSeconds % 60
        ).padStart(2,"0");


    return `${hours}:${minutes}:${seconds}`;

}


/* =====================================================
UPDATE COUNTDOWN
===================================================== */

function updateStreakCountdown(){

    const timer =
        document.getElementById(
            "streak-countdown-value"
        );


    if(!timer){

        return;

    }


    const remaining =
        getNextMidnight().getTime()
        -
        Date.now();


    timer.textContent =
        formatCountdown(
            remaining
        );


    if(remaining <= 0){

        clearInterval(
            streakCountdownInterval
        );

        streakCountdownInterval =
            null;


        renderStreakPage();

    }

}


/* =====================================================
START COUNTDOWN
===================================================== */

function startStreakCountdown(){

    clearInterval(
        streakCountdownInterval
    );


    updateStreakCountdown();


    streakCountdownInterval =
        setInterval(
            updateStreakCountdown,
            1000
        );

}


/* =====================================================
CLAIM DAILY REWARD
===================================================== */

/* =====================================================
   CLAIM DAILY REWARD
   ===================================================== */

function claimDailyStreakReward(){

    const state =
        getStreakState();


    const today =
        localDateKey();


    /*
     * Already claimed today.
     */

    if(
        state.lastClaimDate === today
    ){

        return;

    }


    /*
     * First ever claim.
     */

    if(
        !state.lastClaimDate
    ){

        state.currentStreak =
            1;

    }


    /*
     * Consecutive day.
     */

    else{

        const gap =
            dateDifferenceInDays(
                state.lastClaimDate,
                today
            );


        if(gap === 1){

            state.currentStreak++;

        }

        else{

            /*
             * User missed one or more days.
             * Start a new streak.
             */

            state.currentStreak =
                1;

        }

    }


    /*
     * Update longest streak.
     */

    state.longestStreak =
        Math.max(
            state.longestStreak || 0,
            state.currentStreak
        );


    /*
     * Determine today's reward.
     *
     * The existing interface defines:
     *
     * Days 1–6 = Free Game
     * Day 7 = Bonus / 5 Free Games
     */
const rewardDay =
        (
            (state.currentStreak - 1)
            % 7
        ) + 1;


    let rewardGames =
        1;


    let rewardTitle =
        `Daily Reward — Day ${rewardDay}`;


    let rewardDescription =
        "Daily streak reward";


    if(
        rewardDay === 7
    ){

        rewardGames =
            5;

        rewardTitle =
            "Daily Reward — Day 7 Bonus";

        rewardDescription =
            "7-day streak bonus";

    }
    
    /*
     * AWARD THE FREE GAMES
     *
     * awardSecretCrushFreeGames() both updates the
     * real free-games balance AND logs the reward,
     * so it shows up correctly in Rewards Received
     * and in the Games counter.
     */

    awardSecretCrushFreeGames(
        rewardGames,
        rewardTitle
    );

    updateAppTransactionsBalance();





    /*
     * Move to the next daily reward.
     */

    state.dailyClaimDay =
        rewardDay;


    state.lastClaimDate =
        today;


    /*
     * Save streak state.
     */

    saveStreakState(
        state
    );


    /*
     * Refresh the streak interface.
     */

    renderStreakPage();

}


/* =====================================================
FIND NEXT MILESTONE
===================================================== */

function getNextMilestone(
    currentStreak
){

    return STREAK_MILESTONES.find(
        item =>
            item.day >
            currentStreak
    ) || null;

}


/* =====================================================
DAILY REWARD PANEL
===================================================== */

function renderDailyRewards(state){

    const grid =
        document.getElementById(
            "daily-reward-grid"
        );


    if(!grid){

        return;

    }


    const todayClaimed =
        state.lastClaimDate ===
        localDateKey();


    const todayCycleDay =
        state.dailyClaimDay || 1;


    const cycleDays =
        [1,2,3,4,5,6,7];


    grid.innerHTML =
        cycleDays.map(day=>{

            const claimed =
                todayClaimed
                ?
                day <= todayCycleDay
                :
                day < todayCycleDay;


            const isToday =
                day === todayCycleDay;


            const locked =
                !claimed &&
                day > todayCycleDay;


            let icon;


            if(claimed){

                icon = "✓";

            }

            else if(day === 7){

                icon = "🏆";

            }

            else if(isToday){

                icon = "🎁";

            }

            else if(locked){

                icon = "🔒";

            }

            else{

                icon = "🎁";

            }


            const reward =
                day === 7
                ?
                "Bonus"
                :
                "Free Game";


            return `

                <div
                    class="
                        daily-reward-day
                        ${claimed ? "claimed" : ""}
                        ${isToday ? "today" : ""}
                        ${locked ? "locked" : ""}
                        ${day === 7 ? "bonus" : ""}
                    "
                >

                    <span class="day-label">
                        DAY ${day}
                    </span>

                    <span class="day-icon">
                        ${icon}
                    </span>

                    <span class="day-reward">
                        ${reward}
                    </span>

                </div>

            `;

        }).join("");


    const claimButton =
        document.getElementById(
            "claim-streak-reward"
        );


    const claimText =
        document.getElementById(
            "claim-streak-text"
        );


    const rewardSubtitle =
        document.getElementById(
            "today-reward-subtitle"
        );


    if(todayClaimed){

        claimButton.disabled =
            true;


        claimText.textContent =
            "REWARD CLAIMED";


        rewardSubtitle.textContent =
            "Come back after midnight for tomorrow's reward.";

    }

    else{

        claimButton.disabled =
            false;


        claimText.textContent =
            "CLAIM TODAY'S REWARD";


        rewardSubtitle.textContent =
            "Claim it to keep your streak alive.";

    }

}


/* =====================================================
MY STREAK PANEL
===================================================== */

function renderMyStreak(state){

    const current =
        state.currentStreak || 0;


    const currentEl =
        document.getElementById(
            "current-streak-number"
        );


    const messageEl =
        document.getElementById(
            "streak-message"
        );


    const weekEl =
        document.getElementById(
            "streak-week"
        );


    const titleEl =
        document.getElementById(
            "next-milestone-title"
        );


    const daysEl =
        document.getElementById(
            "next-milestone-days"
        );


    const fillEl =
        document.getElementById(
            "milestone-progress-fill"
        );


    const progressTextEl =
        document.getElementById(
            "milestone-progress-text"
        );


    if(currentEl){

        currentEl.textContent =
            current;

    }


    if(messageEl){

        messageEl.textContent =
            current >= 7
            ?
            "You're on fire!"
            :
            current
            ?
            "Keep it going!"
            :
            "Start your streak today.";

    }


    /*
    Weekly login indicators.
    */

    if(weekEl){

        const labels =
            [
                "M",
                "T",
                "W",
                "T",
                "F",
                "S",
                "S"
            ];


        weekEl.innerHTML =
            labels.map(
                (label,index)=>{

                    const done =
                        current >=
                        index + 1;


                    const today =
                        index === 6;


                    return `

                        <div
                            class="
                                streak-week-day
                                ${done ? "done" : ""}
                                ${today ? "today" : ""}
                            "
                        >

                            <span>
                                ${label}
                            </span>

                            <span class="week-dot">
                                ${done ? "✓" : ""}
                            </span>

                        </div>

                    `;

                }
            ).join("");

    }


    /*
    Next milestone.
    */

    const next =
        getNextMilestone(
            current
        );


    const previous =
        [
            ...STREAK_MILESTONES
        ]
        .reverse()
        .find(
            item =>
                item.day <= current
        );


    const previousDay =
        previous
        ?
        previous.day
        :
        0;


    const target =
        next
        ?
        next.day
        :
        current;


    const progress =
        next
        ?
        Math.min(
            100,
            Math.max(
                0,
                (
                    (current - previousDay)
                    /
                    (target - previousDay)
                ) * 100
            )
        )
        :
        100;


    if(titleEl){

        titleEl.textContent =
            next
            ?
            `${next.day} DAYS`
            :
            "ALL MILESTONES";

    }


    if(daysEl){

        if(next){

            const daysLeft =
                next.day - current;


            daysEl.textContent =
                `${daysLeft} ${
                    daysLeft === 1
                    ?
                    "day"
                    :
                    "days"
                } to go`;

        }

        else{

            daysEl.textContent =
                "You've reached the current top milestone";

        }

    }


    if(fillEl){

        fillEl.style.width =
            `${progress}%`;

    }


    if(progressTextEl){

        progressTextEl.textContent =
            next
            ?
            `${current} / ${next.day} days`
            :
            `${current} days`;

    }

}


/* =====================================================
MILESTONE PANEL
===================================================== */

function renderMilestones(state){

    const list =
        document.getElementById(
            "milestones-list"
        );


    if(!list){

        return;

    }


    const current =
        state.currentStreak || 0;


    list.innerHTML =
        STREAK_MILESTONES.map(
            item=>{

                const reached =
                    current >= item.day;


                const next =
                    !reached &&
                    !STREAK_MILESTONES.some(
                        milestone =>
                            milestone.day > current &&
                            milestone.day < item.day
                    );


                const daysLeft =
                    Math.max(
                        0,
                        item.day - current
                    );


                return `

                    <div
                        class="
                            milestone-card
                            ${reached ? "active" : ""}
                            ${!reached ? "locked" : ""}
                        "
                    >

                        <div class="milestone-badge">

                            ${
                                reached
                                ?
                                "✓"
                                :
                                item.icon
                            }

                        </div>


                        <div
                            class="milestone-card-info"
                        >

                            <strong>
                                ${item.day}-Day Milestone
                            </strong>

                            <span>

                                ${
                                    reached
                                    ?
                                    "Unlocked · "
                                    :
                                    `${daysLeft} ${
                                        daysLeft === 1
                                        ?
                                        "day"
                                        :
                                        "days"
                                    } remaining · `
                                }

                                ${item.reward}

                            </span>

                        </div>


                        <div
                            class="milestone-card-count"
                        >

                            ${
                                reached
                                ?
                                "CLAIMED"
                                :
                                next
                                ?
                                "NEXT"
                                :
                                "LOCKED"
                            }

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =====================================================
RENDER ENTIRE STREAK PAGE
===================================================== */

function renderStreakPage(){

    const state =
        getStreakState();


    renderDailyRewards(state);

    renderMyStreak(state);

    renderMilestones(state);

    startStreakCountdown();

}


/* =====================================================
OPEN STREAKS PAGE
===================================================== */

function openStreaksPage(){

    document
        .querySelectorAll(".app-page")
        .forEach(
            page =>
                page.classList.remove(
                    "active"
                )
        );


    if(!streaksPage){

        return;

    }


    streaksPage.classList.add(
        "active"
    );


    streaksPage.scrollTop =
        0;


    setActiveNavigation("");


    renderStreakPage();


    hideAppNavigation();

}


/* =====================================================
CLAIM BUTTON
===================================================== */

const claimStreakButton =
    document.getElementById(
        "claim-streak-reward"
    );


if(claimStreakButton){

    claimStreakButton.addEventListener(
        "click",
        claimDailyStreakReward
    );

}


/* =====================================================
BACK BUTTON
===================================================== */

const streakBackButton =
    document.getElementById(
        "streaks-back-button"
    );

if(streakBackButton){

    streakBackButton.addEventListener(
        "click",
        () => {

            streaksPage.classList.remove(
                "active"
            );

            openHomepage();
            openSideMenu();
            

        }
    );

}




/* =====================================================
HORIZONTAL PANEL TRACKING
===================================================== */

const streakCarousel =
    document.getElementById(
        "streaks-carousel"
    );


const streakDots =
    document.querySelectorAll(
        "[data-streak-dot]"
    );


if(streakCarousel){

    streakCarousel.addEventListener(
        "scroll",
        ()=>{

            const panelWidth =
                streakCarousel.clientWidth
                -
                36
                +
                14;


            const index =
                Math.min(
                    2,
                    Math.max(
                        0,
                        Math.round(
                            streakCarousel.scrollLeft /
                            panelWidth
                        )
                    )
                );


            document
                .querySelectorAll(
                    ".streaks-page-progress span"
                )
                .forEach(
                    (element,indexNumber)=>{

                        element.classList.toggle(
                            "active",
                            indexNumber === index
                        );

                    }
                );


            streakDots.forEach(
                dot => {

                    dot.classList.toggle(
                        "active",
                        Number(
                            dot.dataset.streakDot
                        ) === index
                    );

                }
            );

        }
    );

}


/* =====================================================
DOT NAVIGATION
===================================================== */

streakDots.forEach(
    dot => {

        dot.addEventListener(
            "click",
            ()=>{

                const index =
                    Number(
                        dot.dataset.streakDot
                    );


                const panel =
                    streakCarousel?.querySelector(
                        `[data-streak-panel="${index}"]`
                    );


                panel?.scrollIntoView({

                    behavior:"smooth",

                    block:"nearest",

                    inline:"center"

                });

            }
        );

    }
);


/* =====================================================
MODULE: SPADE — ACTIVITY HUB
===================================================== */


/* -----------------------------------------------------
OPEN ACTIVITY HUB
----------------------------------------------------- */

function openActivityHub(){

    if(
        !activityHub ||
        !activityHubBackdrop
    ){
        return;
    }


    if(typeof SC_ActivityHub_RefreshCounts === "function"){

        SC_ActivityHub_RefreshCounts();

    }
    
    if(
    typeof updateGuessMyCrushCounts ===
    "function"
){

    updateGuessMyCrushCounts();

}



    activityHub.classList.add("active");

    activityHubBackdrop.classList.add("active");

    activityHub.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "activity-hub-open"
    );

}


/* -----------------------------------------------------
CLOSE ACTIVITY HUB
----------------------------------------------------- */

function closeActivityHub(){

    if(
        !activityHub ||
        !activityHubBackdrop
    ){
        return;
    }


    activityHub.classList.remove("active");

    activityHubBackdrop.classList.remove("active");

    activityHub.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "activity-hub-open"
    );

}


/* =====================================================
OTHER ACTIVITY — STORAGE & EVENT ENGINE
===================================================== */

function SC_OtherActivity_Read(){

    try{

        const saved =
            JSON.parse(
                localStorage.getItem(
                    OTHER_ACTIVITY_STORAGE_KEY
                ) ||
                "[]"
            );


        return Array.isArray(saved)
            ? saved
            : [];

    }catch(error){

        return [];

    }

}


function SC_OtherActivity_Save(
    threads
){

    localStorage.setItem(
        OTHER_ACTIVITY_STORAGE_KEY,
        JSON.stringify(threads)
    );

}


function SC_OtherActivity_FormatTime(
    timestamp
){

    if(!timestamp){
        return "";
    }


    const date =
        new Date(
            Number(timestamp)
        );


    if(
        Number.isNaN(
            date.getTime()
        )
    ){

        return "";

    }


    return date.toLocaleString(
        [],
        {
            day:"numeric",
            month:"short",
            hour:"numeric",
            minute:"2-digit"
        }
    );

}


function SC_OtherActivity_Icon(
    type
){

    const icons = {

        crush:"♡",

        mutual:"♡♡",

        game_started:"🎮",

        game_progress:"🎮",

        game_round_failed:"⚠️",

        clue:"💡",

        reveal_request:"🔓",

        reveal_accepted:"✨",

        reveal_declined:"🔒",

        secret_note:"💌",

        secret_note_reply:"💬",

        gift:"🎁",

        communication:"💬"

    };


    return icons[type] || "✦";

}


function SC_OtherActivity_Add(
    data
){

    if(!data){
        return null;
    }


    const actor =
        data.actorSnapshot ||
        {};


    const actorId =
        String(
            data.actorId ||
            actor.id ||
            actor.username ||
            actor.name ||
            "mystery-sender"
        );


    const eventId =
        String(
            data.id ||
            (
                data.type +
                "-" +
                actorId +
                "-" +
                (
                    data.route?.noteId ||
                    data.route?.crushId ||
                    data.route?.activityId ||
                    data.timestamp ||
                    Date.now()
                )
            )
        );


    const threads =
        SC_OtherActivity_Read();


    let thread =
        threads.find(
            item =>
                item.personId ===
                actorId
        );


    if(!thread){

        thread = {

            personId:
                actorId,

            personSnapshot:{

                id:
                    actorId,

                name:
                    actor.name ||
                    data.actorName ||
                    "Mystery sender",

                username:
                    actor.username ||
                    data.actorUsername ||
                    "",

                photo:
                    actor.photo ||
                    actor.profilePicture ||
                    ""

            },

            activities:[]

        };


        threads.push(
            thread
        );

    }else{

        thread.personSnapshot = {

            ...thread.personSnapshot,

            ...actor,

            name:
                actor.name ||
                data.actorName ||
                thread.personSnapshot.name ||
                "Mystery sender",

            username:
                actor.username ||
                data.actorUsername ||
                thread.personSnapshot.username ||
                "",

            photo:
                actor.photo ||
                actor.profilePicture ||
                thread.personSnapshot.photo ||
                ""

        };

    }


    if(
        thread.activities.some(
            item =>
                item.id ===
                eventId
        )
    ){

        return eventId;

    }


    thread.activities.push({

        id:
            eventId,

        type:
            data.type ||
            "communication",

        title:
            data.title ||
            "New activity",

        description:
            data.description ||
            "",

        timestamp:
            Number(
                data.timestamp
            ) ||
            Date.now(),

        read:
            data.read === true,

        route:
            data.route ||
            {},

        meta:
            data.meta ||
            {}

    });


    thread.activities.sort(
        (a,b) =>
            Number(
                b.timestamp ||
                0
            ) -
            Number(
                a.timestamp ||
                0
            )
    );


    SC_OtherActivity_Save(
        threads
    );


    return eventId;

}


function SC_OtherActivity_MarkRead(
    personId,
    activityId
){

    const threads =
        SC_OtherActivity_Read();


    const thread =
        threads.find(
            item =>
                item.personId ===
                personId
        );


    if(!thread){
        return;
    }


    const activity =
        thread.activities.find(
            item =>
                item.id ===
                activityId
        );


    if(activity){

        activity.read =
            true;


        SC_OtherActivity_Save(
            threads
        );


        SC_OtherActivity_UpdateBadge();

    }

}


function SC_OtherActivity_GetThread(
    personId
){

    return SC_OtherActivity_Read()
        .find(
            item =>
                item.personId ===
                personId
        ) ||
        null;

}


function SC_OtherActivity_UnreadCount(
    thread
){

    return (
        thread?.activities ||
        []
    )
    .filter(
        item =>
            item.read !== true
    )
    .length;

}


/* =====================================================
SYNC EXISTING SECRET CRUSH DATA
===================================================== */

function SC_OtherActivity_SyncCurrentData(){

    /*
     * Existing sent crushes provide local activity
     * until the real backend sends live events.
     */

    if(
        typeof getSentCrushDisplayData ===
        "function"
    ){

        getSentCrushDisplayData()
            .forEach(
                crush => {

                    const target =
                        typeof getSentCrushTarget ===
                        "function"

                            ? getSentCrushTarget(
                                crush
                            )

                            : crush.targetSnapshot ||
                              {};


                    if(
                        !target &&
                        !crush.targetName
                    ){

                        return;

                    }


                    const actor = {

                        id:
                            target?.id ||
                            crush.targetId ||
                            crush.id,

                        name:
                            target?.name ||
                            crush.targetName ||
                            "Mystery sender",

                        username:
                            target?.username ||
                            "",

                        photo:
                            target?.photo ||
                            target?.profilePicture ||
                            ""

                    };


                    const crushId =
                        crush.id;


                    const level =
                        Number(
                            crush.level
                        ) ||
                        1;


                    SC_OtherActivity_Add({

                        id:
                            "game-progress-" +
                            crushId +
                            "-" +
                            (
                                crush.updatedAt ||
                                level
                            ),

                        actorId:
                            actor.id,

                        actorSnapshot:
                            actor,

                        type:
                            crush.mutual === true
                                ? "mutual"
                                : "game_progress",

                        title:
                            crush.mutual === true

                                ? "You have a mutual crush"

                                : `${actor.name} progressed to Round ${level}`,

                        description:
                            crush.mutual === true

                                ? `${actor.name} chose you back.`

                                : (
                                    crush.status ||
                                    `Their game is currently on Round ${level}.`
                                ),

                        timestamp:
                            Number(
                                crush.updatedAt ||
                                crush.createdAt
                            ) ||
                            Date.now(),

                        read:true,

                        route:
                            crush.mutual === true

                                ? {
                                    type:"mutual",
                                    crushId:crushId
                                }

                                : {
                                    type:"sent-crush-progress",
                                    crushId:crushId,
                                    slide:2
                                }

                    });


                    /*
                     * Existing reveal requests.
                     */

                    (
                        crush.revealRequests ||
                        []
                    )
                    .forEach(
                        (
                            field,
                            index
                        ) => {

                            SC_OtherActivity_Add({

                                id:
                                    "reveal-request-" +
                                    crushId +
                                    "-" +
                                    field,

                                actorId:
                                    actor.id,

                                actorSnapshot:
                                    actor,

                                type:
                                    "reveal_request",

                                title:
                                    `${actor.name} requested a reveal`,

                                description:
                                    `${actor.name} is asking you to reveal your ${field}.`,

                                timestamp:
                                    (
                                        Number(
                                            crush.updatedAt ||
                                            crush.createdAt
                                        ) +
                                        index +
                                        1
                                    ) ||
                                    Date.now(),

                                read:false,

                                route:{

                                    type:
                                        "sent-crush-reveal",

                                    crushId:
                                        crushId,

                                    slide:1

                                },

                                meta:{
                                    field
                                }

                            });

                        }
                    );

                }
            );

    }


    /*
     * Existing received Secret Notes.
     */

    if(
        typeof SC_SecretNotes_GetReceived ===
        "function"
    ){

        SC_SecretNotes_GetReceived()
            .forEach(
                note => {

                    const person =
                        typeof SC_SecretNotes_GetPerson ===
                        "function"

                            ? SC_SecretNotes_GetPerson(
                                note,
                                "received"
                            )

                            : {};


                    const revealed =
                        Array.isArray(
                            note.revealedFields
                        )
                            ? note.revealedFields
                            : [];


                    const hasName =
                        revealed.includes(
                            "name"
                        ) ||
                        !!note.senderNameRevealed;


                    const displayName =
                        hasName

                            ? (
                                person.name ||
                                note.senderName ||
                                "Someone"
                            )

                            : "mystery sender";


                    SC_OtherActivity_Add({

                        id:
                            "secret-note-" +
                            note.id,

                        actorId:
                            note.senderId ||
                            note.senderSnapshot?.id ||
                            note.senderUsername ||
                            "mystery-sender-" +
                            note.id,

                        actorSnapshot:{

                            id:
                                note.senderId ||
                                note.senderSnapshot?.id ||
                                "mystery-sender-" +
                                note.id,

                            name:
                                hasName
                                    ? displayName
                                    : "Mystery sender",

                            username:
                                note.senderUsername ||
                                note.senderSnapshot?.username ||
                                "",

                            photo:
                                note.senderPhoto ||
                                note.senderSnapshot?.photo ||
                                ""

                        },

                        type:
                            "secret_note",

                        title:
                            `You have received a secret note from ${displayName}`,

                        description:
                            "Tap to open the note directly.",

                        timestamp:
                            Number(
                                note.receivedAt ||
                                note.createdAt
                            ) ||
                            Date.now(),

                        read:
                            typeof SC_SecretNotes_IsRead ===
                            "function"

                                ? SC_SecretNotes_IsRead(
                                    note.id
                                )

                                : note.read === true,

                        route:{

                            type:
                                "secret-note",

                            noteId:
                                note.id,

                            mode:
                                "received"

                        }

                    });

                }
            );

    }

}


function SC_OtherActivity_UpdateBadge(){

    const threads =
        SC_OtherActivity_Read();


    const total =
        threads.reduce(
            (
                sum,
                thread
            ) =>
                sum +
                SC_OtherActivity_UnreadCount(
                    thread
                ),
            0
        );


    if(otherActivityBadge){

        otherActivityBadge.hidden =
            total === 0;


        otherActivityBadge.textContent =
            String(total);

    }

}


/* =====================================================
RENDER MAIN OTHER ACTIVITY PAGE
===================================================== */

function SC_OtherActivity_Render(){

    SC_OtherActivity_SyncCurrentData();

    SC_OtherActivity_UpdateBadge();


    if(!otherActivityList){
        return;
    }


    const threads =
        SC_OtherActivity_Read()
            .filter(
                thread =>
                    Array.isArray(
                        thread.activities
                    ) &&
                    thread.activities.length
            )
            .sort(
                (
                    a,
                    b
                ) => {

                    const aTime =
                        Number(
                            a.activities[0]?.timestamp ||
                            0
                        );


                    const bTime =
                        Number(
                            b.activities[0]?.timestamp ||
                            0
                        );


                    return bTime - aTime;

                }
            );


    otherActivityList.innerHTML =
        "";


    if(otherActivityEmpty){

        otherActivityEmpty.hidden =
            threads.length > 0;

    }


    threads.forEach(
        thread => {

            const latest =
                thread.activities[0];


            const unread =
                SC_OtherActivity_UnreadCount(
                    thread
                );


            const person =
                thread.personSnapshot ||
                {};


            const card =
                document.createElement(
                    "button"
                );


            card.type =
                "button";


            card.className =
                "other-activity-person-card";


            const photo =
                person.photo ||
                person.profilePicture ||
                "";


            const avatar =
                photo

                    ? `<img src="${escapePostHTML(photo)}" alt="">`

                    : "♡";


            card.innerHTML = `

                <span class="other-activity-avatar">
                    ${avatar}
                </span>


                <span class="other-activity-person-main">

                    <span class="other-activity-person-name">
                        ${escapePostHTML(
                            person.name ||
                            "Mystery sender"
                        )}
                    </span>


                    ${
                        person.username

                            ? `
                                <span
                                    class="other-activity-person-username"
                                >
                                    ${escapePostHTML(
                                        person.username
                                    )}
                                </span>
                            `

                            : ""
                    }


                    <span class="other-activity-person-preview">
                        ${escapePostHTML(
                            latest.title ||
                            "New activity"
                        )}
                    </span>


                    <span class="other-activity-person-time">
                        ${SC_OtherActivity_FormatTime(
                            latest.timestamp
                        )}
                    </span>

                </span>


                <span class="other-activity-person-right">

                    ${
                        unread

                            ? `
                                <span
                                    class="other-activity-unread-dot"
                                ></span>
                            `

                            : ""
                    }


                    ${
                        unread > 1

                            ? `
                                <span
                                    class="other-activity-unread-count"
                                >
                                    ${unread}
                                </span>
                            `

                            : ""
                    }


                    <span class="other-activity-arrow">
                        ›
                    </span>

                </span>

            `;


            card.addEventListener(
                "click",
                () =>
                    SC_OtherActivity_OpenThread(
                        thread.personId
                    )
            );


            otherActivityList.appendChild(
                card
            );

        }
    );

}


function SC_OtherActivity_OpenPage(){

    SC_OtherActivity_Render();


    if(otherActivityPage){

        otherActivityPage.classList.add(
            "active"
        );


        otherActivityPage.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    if(activityHub){

        activityHub.classList.remove(
            "active"
        );


        activityHub.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if(activityHubBackdrop){

        activityHubBackdrop.classList.remove(
            "active"
        );

    }


    document.body.classList.add(
        "other-activity-open"
    );

}


function SC_OtherActivity_ClosePage(){

    SC_OtherActivity_CloseThread();


    if(otherActivityPage){

        otherActivityPage.classList.remove(
            "active"
        );


        otherActivityPage.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    document.body.classList.remove(
        "other-activity-open"
    );


    openActivityHub();

}


/* =====================================================
OPEN PERSON ACTIVITY THREAD
===================================================== */

function SC_OtherActivity_OpenThread(
    personId
){

    const thread =
        SC_OtherActivity_GetThread(
            personId
        );


    if(
        !thread ||
        !otherActivityThread
    ){

        return;

    }


    activeOtherActivityPersonId =
        personId;


    const person =
        thread.personSnapshot ||
        {};


    const photo =
        person.photo ||
        person.profilePicture ||
        "";


    const avatar =
        photo

            ? `<img src="${escapePostHTML(photo)}" alt="">`

            : "♡";


    otherActivityThreadHeader.innerHTML = `

        <button
            type="button"
            class="other-activity-thread-back"
            id="other-activity-thread-back-button"
            aria-label="Back to other activity"
        >
            ‹
        </button>


        <span class="other-activity-thread-profile">
            ${avatar}
        </span>


        <span class="other-activity-thread-person">

            <strong>
                ${escapePostHTML(
                    person.name ||
                    "Mystery sender"
                )}
            </strong>


            ${
                person.username

                    ? `
                        <small>
                            ${escapePostHTML(
                                person.username
                            )}
                        </small>
                    `

                    : ""
            }

        </span>

    `;


    const back =
        document.getElementById(
            "other-activity-thread-back-button"
        );


    back?.addEventListener(
        "click",
        SC_OtherActivity_CloseThread
    );


    otherActivityThreadList.innerHTML =
        "";


    [...thread.activities]
        .sort(
            (
                a,
                b
            ) =>
                Number(
                    b.timestamp ||
                    0
                ) -
                Number(
                    a.timestamp ||
                    0
                )
        )
        .forEach(
            activity => {

                const item =
                    document.createElement(
                        "button"
                    );


                item.type =
                    "button";


                item.className =
                    "other-activity-item" +
                    (
                        activity.read
                            ? ""
                            : " unread"
                    );


                item.innerHTML = `

                    <span
                        class="other-activity-item-icon"
                    >
                        ${SC_OtherActivity_Icon(
                            activity.type
                        )}
                    </span>


                    <span
                        class="other-activity-item-content"
                    >

                        <span
                            class="other-activity-item-title"
                        >
                            ${escapePostHTML(
                                activity.title ||
                                "New activity"
                            )}
                        </span>


                        ${
                            activity.description

                                ? `
                                    <span
                                        class="other-activity-item-description"
                                    >
                                        ${escapePostHTML(
                                            activity.description
                                        )}
                                    </span>
                                `

                                : ""
                        }


                        <span
                            class="other-activity-item-time"
                        >
                            ${SC_OtherActivity_FormatTime(
                                activity.timestamp
                            )}
                        </span>

                    </span>


                    <span
                        class="other-activity-item-right"
                    >

                        ${
                            activity.read

                                ? ""

                                : `
                                    <span
                                        class="other-activity-item-dot"
                                    ></span>
                                `
                        }

                    </span>

                `;


                item.addEventListener(
                    "click",
                    () => {

                        SC_OtherActivity_MarkRead(
                            personId,
                            activity.id
                        );


                        SC_OtherActivity_RenderThreadAfterRead(
                            personId
                        );


                        SC_OtherActivity_Route(
                            activity
                        );

                    }
                );


                otherActivityThreadList.appendChild(
                    item
                );

            }
        );


    otherActivityThread.classList.add(
        "active"
    );


    otherActivityThread.setAttribute(
        "aria-hidden",
        "false"
    );

}


function SC_OtherActivity_RenderThreadAfterRead(
    personId
){

    const thread =
        SC_OtherActivity_GetThread(
            personId
        );


    if(
        !thread ||
        !otherActivityThreadList
    ){

        return;

    }


    const scrollTop =
        otherActivityThreadList.scrollTop;


    otherActivityThreadList.innerHTML =
        "";


    [...thread.activities]
        .sort(
            (
                a,
                b
            ) =>
                Number(
                    b.timestamp ||
                    0
                ) -
                Number(
                    a.timestamp ||
                    0
                )
        )
        .forEach(
            activity => {

                const item =
                    document.createElement(
                        "button"
                    );


                item.type =
                    "button";


                item.className =
                    "other-activity-item" +
                    (
                        activity.read
                            ? ""
                            : " unread"
                    );


                item.innerHTML = `

                    <span
                        class="other-activity-item-icon"
                    >
                        ${SC_OtherActivity_Icon(
                            activity.type
                        )}
                    </span>


                    <span
                        class="other-activity-item-content"
                    >

                        <span
                            class="other-activity-item-title"
                        >
                            ${escapePostHTML(
                                activity.title ||
                                "New activity"
                            )}
                        </span>


                        ${
                            activity.description

                                ? `
                                    <span
                                        class="other-activity-item-description"
                                    >
                                        ${escapePostHTML(
                                            activity.description
                                        )}
                                    </span>
                                `

                                : ""
                        }


                        <span
                            class="other-activity-item-time"
                        >
                            ${SC_OtherActivity_FormatTime(
                                activity.timestamp
                            )}
                        </span>

                    </span>


                    <span
                        class="other-activity-item-right"
                    >

                        ${
                            activity.read
                                ? ""
                                : `
                                    <span
                                        class="other-activity-item-dot"
                                    ></span>
                                `
                        }

                    </span>

                `;


                item.addEventListener(
                    "click",
                    () => {

                        SC_OtherActivity_MarkRead(
                            personId,
                            activity.id
                        );


                        SC_OtherActivity_RenderThreadAfterRead(
                            personId
                        );


                        SC_OtherActivity_Route(
                            activity
                        );

                    }
                );


                otherActivityThreadList.appendChild(
                    item
                );

            }
        );


    otherActivityThreadList.scrollTop =
        scrollTop;

}


function SC_OtherActivity_CloseThread(){

    if(otherActivityThread){

        otherActivityThread.classList.remove(
            "active"
        );


        otherActivityThread.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    activeOtherActivityPersonId =
        null;

}


/* =====================================================
ACTIVITY → DESTINATION ROUTING
===================================================== */

function SC_OtherActivity_Route(
    activity
){

    const route =
        activity?.route ||
        {};


    /*
     * GAME PROGRESS
     */

    if(
        route.type ===
        "sent-crush-progress"
    ){

        SC_OtherActivity_CloseThread();

        SC_OtherActivity_ClosePageWithoutHub();


        setTimeout(
            () => {

                openSentCrushes();


                setTimeout(
                    () => {

                        openSentCrushDetail(
                            route.crushId
                        );


                        SC_OtherActivity_SetSentCrushSlide(
                            route.slide ??
                            2
                        );

                    },
                    100
                );

            },
            100
        );


        return;

    }


    /*
     * REVEAL REQUEST
     */

    if(
        route.type ===
        "sent-crush-reveal"
    ){

        SC_OtherActivity_CloseThread();

        SC_OtherActivity_ClosePageWithoutHub();


        setTimeout(
            () => {

                openSentCrushes();


                setTimeout(
                    () => {

                        openSentCrushDetail(
                            route.crushId
                        );


                        SC_OtherActivity_SetSentCrushSlide(
                            route.slide ??
                            1
                        );

                    },
                    100
                );

            },
            100
        );


        return;

    }


    /*
     * SECRET NOTES
     */

    if(
        route.type ===
            "secret-note" ||

        route.type ===
            "secret-note-reply"
    ){

        SC_OtherActivity_CloseThread();

        SC_OtherActivity_ClosePageWithoutHub();


        setTimeout(
            () => {

                openSecretNotes();


                SC_SecretNotes_SetTab(
                    route.mode === "sent"
                        ? "sent"
                        : "received",
                    false
                );


                setTimeout(
                    () => {

                        SC_SecretNotes_OpenNote(
                            route.noteId,
                            route.mode ||
                            "received"
                        );

                    },
                    100
                );

            },
            100
        );


        return;

    }


    /*
     * MUTUAL CRUSH
     */

    if(
        route.type ===
        "mutual"
    ){

        SC_OtherActivity_CloseThread();

        SC_OtherActivity_ClosePageWithoutHub();


        setTimeout(
            openMutualCrushesPage,
            120
        );

    }

}


function SC_OtherActivity_ClosePageWithoutHub(){

    if(otherActivityPage){

        otherActivityPage.classList.remove(
            "active"
        );


        otherActivityPage.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    document.body.classList.remove(
        "other-activity-open"
    );

}


function SC_OtherActivity_SetSentCrushSlide(
    slide
){

    if(!sentCrushDetailTrack){
        return;
    }


    const width =
        sentCrushDetailTrack.clientWidth;


    if(!width){
        return;
    }


    sentCrushDetailTrack.scrollTo({

        left:
            width *
            Number(
                slide ||
                0
            ),

        behavior:
            "smooth"

    });


    if(
        typeof updateSentCrushSlideDots ===
        "function"
    ){

        setTimeout(
            updateSentCrushSlideDots,
            200
        );

    }

}

/* -----------------------------------------------------
SPADE BUTTON
----------------------------------------------------- */

if(activityHubButton){

    activityHubButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            openActivityHub();

        }
    );

}


/* -----------------------------------------------------
CLOSE BUTTON
----------------------------------------------------- */

if(activityHubClose){

    activityHubClose.addEventListener(
        "click",
        closeActivityHub
    );

}


/* -----------------------------------------------------
BACKDROP
----------------------------------------------------- */

if(activityHubBackdrop){

    activityHubBackdrop.addEventListener(
        "click",
        closeActivityHub
    );

}


/* -----------------------------------------------------
ESCAPE KEY
----------------------------------------------------- */

document.addEventListener(
    "keydown",
    event => {

        if(
            event.key === "Escape" &&
            activityHub &&
            activityHub.classList.contains("active")
        ){

            closeActivityHub();

        }

    }
);


/* -----------------------------------------------------
ACTIVITY CARDS — VISUAL ONLY FOR NOW
----------------------------------------------------- */

/* -----------------------------------------------------
ACTIVITY CARDS — VISUAL ONLY FOR NOW
----------------------------------------------------- */

activityCards.forEach(card => {

    card.addEventListener(
        "click",
        () => {

            const activity =
                card.dataset.activity;

            console.log(
                "Activity selected:",
                activity
            );

        }
    );

});


/* =====================================================
CONNECT ACTIVITY HUB → INCOMING CRUSHES / NEW MUTUALS
===================================================== */

activityCards.forEach(card => {

    if(
        card.dataset.activity ===
        "incoming-crushes"
    ){

        card.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                closeActivityHub();

                setTimeout(
                    openIncomingCrushes,
                    180
                );

            }
        );

    }


    if(
        card.dataset.activity ===
        "new-mutuals"
    ){

        card.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                closeActivityHub();

                setTimeout(
                    openMutualCrushesPage,
                    180
                );

            }
        );

    }

});

/* =====================================================
ACTIVITY HUB → OTHER ACTIVITY
===================================================== */

activityCards.forEach(
    card => {

        if(
            card.dataset.activity !==
            "other-activity"
        ){

            return;

        }


        card.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                SC_OtherActivity_OpenPage();

            }
        );

    }
);


if(otherActivityBack){

    otherActivityBack.addEventListener(
        "click",
        SC_OtherActivity_ClosePage
    );

}


if(otherActivityBackdrop){

    otherActivityBackdrop.addEventListener(
        "click",
        SC_OtherActivity_ClosePage
    );

}


if(otherActivityThreadBackdrop){

    otherActivityThreadBackdrop.addEventListener(
        "click",
        SC_OtherActivity_CloseThread
    );

}

/* =====================================================
MODULE: INCOMING CRUSHES
===================================================== */

/*
=========================================================
DEMO DATA ONLY
=========================================================

These are temporary users used while we build the UI.

LATER:
Replace SC_DEMO_CRUSHES with data fetched from your
real database/backend.

The rendering functions below do NOT need to be rebuilt.
=========================================================
*/

const SC_DEMO_MODE = true;


/*
 * MUTUAL CRUSH COIN COSTS
 *
 * LATER: These can become configurable / server
 * driven values instead of fixed constants.
 */

const MUTUAL_REVEAL_COST = 10;
const MUTUAL_CHAT_COST_BEFORE_REVEAL = 60;
const MUTUAL_CHAT_COST_AFTER_REVEAL = 30;


const SC_DEMO_CRUSHES = [
{
        id:"claire-demo-001",

        name:"Claire",

        username:"@claire_k",

        photo:null,

        className:"Attractive",

        year:"2nd Year",

        faculty:"Business & Economics",

        school:"Daystar University",

        interests:[
            "Travel",
            "Music",
            "Food",
            "Books",
            "Fitness"
        ],

        posts:[
            {
                emoji:"🌇",
                caption:"Sunsets just hit different here.",
                likes:12
            },
            {
                emoji:"☕",
                caption:"Coffee before anything else.",
                likes:8
            },
            {
                emoji:"📚",
                caption:"Library nights, no regrets.",
                likes:15
            }
        ],

        /*
         * MUTUAL CRUSH STATE
         *
         * mutual: true once this incoming crush is
         * detected to also have a crush sent to them.
         *
         * mutualRevealed / mutualChatUnlocked track
         * whether coins have already been spent on
         * each step, so the correct price and screen
         * show up next time.
         */

        mutual:true,

        mutualRevealed:false,

        mutualChatUnlocked:false,

        revealed:{
            name:false,
            year:false,
            school:false,
            faculty:false
        },

        revealedClues:[
            "Loves listening to R&B music.",
            "Plays basketball.",
            "Usually studies in the evening."
        ],

        hiddenClues:[
            {
                id:"claire-hidden-1",
                text:"Her favourite spot on campus.",
                cost:15,
                revealed:false
            },
            {
                id:"claire-hidden-2",
                text:"Something the two of you have in common.",
                cost:20,
                revealed:false
            }
        ],

        goldenClue:{
            text:"A very strong clue about where you first met.",
            cost:30,
            revealed:false
        }
    },


    {
        id:"brian-demo-002",

        name:"Brian",

        photo:null,

        className:"Very Attractive",

        year:"1st Year",

        school:"Kenyatta University",

        faculty:"Engineering",

        mutual:false,

        mutualRevealed:false,

        mutualChatUnlocked:false,

        revealed:{            name:false,
            year:true,
            school:false,
            faculty:false
        },

        revealedClues:[
            "Enjoys football.",
            "Listens to Afrobeats."
        ],

        hiddenClues:[
            {
                id:"brian-hidden-1",
                text:"His favourite place to hang out.",
                cost:15,
                revealed:false
            },
            {
                id:"brian-hidden-2",
                text:"A habit you may have noticed about him.",
                cost:20,
                revealed:false
            }
        ],

        goldenClue:{
            text:"A clue connected to the first place you noticed him.",
            cost:35,
            revealed:false
        }
    },


{
        id:"nelly-demo-003",

        name:"Nelly",

        photo:null,

        className:"Normal",

        year:"3rd Year",

        school:"University of Nairobi",

        faculty:"Arts",

        mutual:false,

        mutualRevealed:false,

        mutualChatUnlocked:false,

        revealed:{
            name:false,
            year:false,
            school:false,
            faculty:true
        },

        revealedClues:[
            "Loves reading.",
            "Enjoys live music."
        ],

        hiddenClues:[
            {
                id:"nelly-hidden-1",
                text:"Her favourite place in school.",
                cost:15,
                revealed:false
            }
        ],

        goldenClue:{
            text:"A special clue chosen specifically for this game.",
            cost:30,
            revealed:false
        }
    },


{
        id:"ivy-demo-004",

        name:"Ivy",

        username:"@ivy.codes",

        photo:null,

        className:"Attractive",

        year:"2nd Year",

        faculty:"Computer Science",

        school:"University of Nairobi",

        interests:[
            "Gaming",
            "Coffee",
            "Board Games",
            "Music"
        ],

        posts:[
            {
                emoji:"🎮",
                caption:"Game night was undefeated.",
                likes:20
            },
            {
                emoji:"🎧",
                caption:"Earphones in, world out.",
                likes:9
            }
        ],

        mutual:true,

        mutualRevealed:false,

        mutualChatUnlocked:false,

        revealed:{name:false,
            year:false,
            school:false,
            faculty:true
            
        },

        revealedClues:[
            "Loves board games.",
            "Always has earphones in."
        ],

        hiddenClues:[
            {
                id:"ivy-hidden-1",
                text:"Her favourite coffee order.",
                cost:15,
                revealed:false
            }
        ],

        goldenClue:{
            text:"A clue about where she noticed you first.",
            cost:30,
            revealed:false
        }
    }

];


/* =====================================================
REFERENCES
===================================================== */

const incomingCrushView =
    document.getElementById("incoming-crush-view");

const incomingCrushBackdrop =
    document.getElementById("incoming-crush-backdrop");

const incomingCrushBack =
    document.getElementById("incoming-crush-back");

const incomingCrushList =
    document.getElementById("incoming-crush-list");

const incomingCrushCount =
    document.getElementById("incoming-crush-count");

const crushRevealModal =
    document.getElementById("crush-reveal-modal");

const crushRevealBackdrop =
    document.getElementById("crush-reveal-backdrop");

const crushRevealClose =
    document.getElementById("crush-reveal-close");

const crushRevealFields =
    document.getElementById("crush-reveal-fields");

const crushRevealTitle =
    document.getElementById("crush-reveal-title");

const crushGameModal =
    document.getElementById("crush-game-modal");

const crushGameBackdrop =
    document.getElementById("crush-game-backdrop");

const crushGameClose =
    document.getElementById("crush-game-close");

const crushGameTitle =
    document.getElementById("crush-game-title");

const crushGameProfile =
    document.getElementById("crush-game-profile");

const crushGameInfoGrid =
    document.getElementById("crush-game-info-grid");

const crushRevealedClues =
    document.getElementById("crush-revealed-clues");

const crushHiddenClues =
    document.getElementById("crush-hidden-clues");

const crushGoldenClue =
    document.getElementById("crush-golden-clue");

const crushStartGameButton =
    document.getElementById("crush-start-game-button");

const crushGameIntro =
    document.getElementById("crush-game-intro");

const crushGameQuestionScreen =
    document.getElementById("crush-game-question-screen");


let activeIncomingCrush = null;


/* =====================================================
OPEN INCOMING CRUSHES
===================================================== */

function openIncomingCrushes(){

    if(!incomingCrushView) return;

    renderIncomingCrushes();

    SC_Activity_MarkAllSeen(
        "incoming",
        SC_DEMO_CRUSHES.map(crush => crush.id)
    );

    SC_ActivityHub_RefreshCounts();

    incomingCrushView.classList.add("active");

    incomingCrushView.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* =====================================================
CLOSE INCOMING CRUSHES
===================================================== */

function closeIncomingCrushes(){

    if(!incomingCrushView) return;

    incomingCrushView.classList.remove("active");

    incomingCrushView.setAttribute(
        "aria-hidden",
        "true"
    );
    
    openActivityHub();

}


/* =====================================================
RENDER CRUSHES
===================================================== */
function renderIncomingCrushes(){

    if(!incomingCrushList) return;


    const games =
        getCrushGames();


    /*
     * Untouched crushes appear first.
     * Games already started are pushed below them.
     */

    const crushes =
        [...SC_DEMO_CRUSHES].sort(
            (a,b) => {

                const aInProgress =
                    games.some(
                        game =>
                            game.crushId === a.id &&
                            game.status === "in-progress"
                    );

                const bInProgress =
                    games.some(
                        game =>
                            game.crushId === b.id &&
                            game.status === "in-progress"
                    );


                return (
                    Number(aInProgress) -
                    Number(bInProgress)
                );

            }
        );


    incomingCrushList.innerHTML = "";


    if(incomingCrushCount){

        incomingCrushCount.textContent =
            `${crushes.length} people have a crush on you`;

    }


    const savedNames =
        getCrushNames();


    crushes.forEach(
        crush => {

            const game =
                games.find(
                    item =>
                        item.crushId === crush.id &&
                        item.status === "in-progress"
                );


            const inProgress =
                Boolean(game);


            const customName =
                savedNames[crush.id] ||
                game?.customName ||
                "";


            const displayName =
                customName ||
                (
                    crush.revealed.name
                        ? crush.name
                        : "Mystery"
                );


            const card =
                document.createElement("article");


            card.className =
                "incoming-crush-card" +
                (
                    inProgress
                        ? " incoming-crush-card-in-progress"
                        : ""
                );


            card.dataset.crushId =
                crush.id;


            card.innerHTML = `

                <div class="incoming-crush-card-glow"></div>


                <div class="incoming-crush-photo-column">

                    <div class="incoming-crush-photo-wrap">

                        ${
                            crush.photo

                            ? `
                                <img
                                    src="${crush.photo}"
                                    alt="Profile"
                                    class="incoming-crush-photo"
                                >
                            `

                            : `
                                <div
                                    class="
                                        incoming-crush-photo
                                        hidden-photo
                                    "
                                >
                                    ?
                                </div>
                            `
                        }

                    </div>


                    ${
                        !inProgress

                        ? `
                            <button
                                type="button"
                                class="mini-reveal-button"
                                data-reveal-crush="${crush.id}"
                            >
                                REVEAL
                            </button>
                        `

                        : `
                            <span class="incoming-crush-status-mini">
                                IN PROGRESS
                            </span>
                        `
                    }

                </div>


                <div class="incoming-crush-details">

                    <div class="incoming-crush-heading">

                        <div>

                            <span class="incoming-crush-eyebrow">
                                SOMEONE HAS A CRUSH ON YOU
                            </span>

                            <h3 class="incoming-crush-display-name">
                                ${displayName}
                            </h3>

                            ${
                                customName
                                    ? `
                                        <small class="incoming-crush-game-name">
                                            Game: ${customName}
                                        </small>
                                    `
                                    : ""
                            }

                        </div>


                        <span class="incoming-crush-class">
                            ${crush.className}
                        </span>

                    </div>


                    <div class="incoming-crush-info-grid">

                        ${createCrushDetailRow(
                            "Name",
                            crush.revealed.name
                                ? crush.name
                                : "Hidden"
                        )}

                        ${createCrushDetailRow(
                            "Institution",
                            crush.revealed.school
                                ? crush.school
                                : "Hidden"
                        )}

                        ${createCrushDetailRow(
                            "Faculty",
                            crush.revealed.faculty
                                ? crush.faculty
                                : "Hidden"
                        )}

                        ${createCrushDetailRow(
                            "Year",
                            crush.revealed.year
                                ? crush.year
                                : "Hidden"
                        )}

                    </div>


                    <div class="incoming-crush-clues">

                        <div class="incoming-crush-section-title">
                            <span>✦</span>
                            Clues
                        </div>


                        <div class="incoming-crush-clue-list">

                            ${
                                (crush.revealedClues || [])
                                    .map(
                                        clue => `
                                            <span>
                                                ${clue}
                                            </span>
                                        `
                                    )
                                    .join("")
                            }

                        </div>


                        <div class="incoming-crush-golden-preview">

                            <span>★</span>

                            <div>

                                <strong>
                                    Golden Clue
                                </strong>

                                <small>
                                    ${
                                        crush.goldenClue?.revealed
                                            ? crush.goldenClue.text
                                            : "Special clue available inside the game"
                                    }
                                </small>

                            </div>

                        </div>

                    </div>


                    ${
                        inProgress

                        ? `

                            <div class="incoming-crush-in-progress">

                                <span class="incoming-progress-dot"></span>

                                <span>
                                    Game in progress
                                </span>

                            </div>

                        `

                        : `

                            <div class="incoming-crush-actions">

                                <button
                                    type="button"
                                    class="incoming-reveal-button"
                                    data-reveal-crush="${crush.id}"
                                >
                                    REQUEST REVEAL
                                </button>


                                <button
                                    type="button"
                                    class="incoming-game-button"
                                    data-game-crush="${crush.id}"
                                >
                                    🎮 PLAY GAME
                                </button>

                            </div>

                        `
                    }

                </div>

            `;


            incomingCrushList.appendChild(card);

        }
    );


    attachIncomingCrushButtons();

}


/* =====================================================
MUTUAL CRUSHES — REFERENCES
===================================================== */

const mutualCrushView =
    document.getElementById("mutual-crush-view");

const mutualCrushBackdrop =
    document.getElementById("mutual-crush-backdrop");

const mutualCrushBack =
    document.getElementById("mutual-crush-back");

const mutualCrushList =
    document.getElementById("mutual-crush-list");

const mutualCrushCount =
    document.getElementById("mutual-crush-count");

const mutualCrushMessage =
    document.getElementById("mutual-crush-message");


/* =====================================================
SPEND BANK COINS

Shared helper for any feature that needs to charge
coins (mutual crush reveal, mutual crush chat, etc.).

Returns true if the spend succeeded, false if the
user doesn't have enough coins.
===================================================== */
/* =====================================================
SPEND BANK COINS

CENTRAL COIN SPENDING FUNCTION

Every feature that spends coins should use this
function so that:

1. Bank balance changes
2. Profile balance changes
3. Homepage balance changes
4. Other visible balances update
5. Spending history is recorded
===================================================== */

function spendBankCoins(
    amount,
    title = "Coins Spent"
){

    const cost =
        Number(amount) || 0;

    if(cost <= 0){

        return true;

    }


    const balance =
        getBankCoinBalance();


    if(balance < cost){

        return false;

    }


    const newBalance =
        balance - cost;


    /* -------------------------------------------------
       SAVE CENTRAL BANK BALANCE
    ------------------------------------------------- */

    localStorage.setItem(
        SC_COINS_KEY,
        String(newBalance)
    );


    /* -------------------------------------------------
       KEEP PROFILE BALANCE IN SYNC
    ------------------------------------------------- */

    syncProfileCoinBalance(
        newBalance
    );


    /* -------------------------------------------------
       RECORD EXPENDITURE
    ------------------------------------------------- */

    recordAppSpend({

        title:
            title,

        amount:
            cost

    });


    /* -------------------------------------------------
       REFRESH ALL COIN DISPLAYS
    ------------------------------------------------- */

    if(
        typeof updateAllCoinDisplays ===
        "function"
    ){

        updateAllCoinDisplays();

    }


    if(
        typeof updateAppTransactionsBalance ===
        "function"
    ){

        updateAppTransactionsBalance();

    }


    if(
        typeof updateBankBalance ===
        "function"
    ){

        updateBankBalance();

    }


    return true;

}


/* =====================================================
RECORD A SPENDING TRANSACTION
===================================================== */

function recordAppSpend({title, amount}){

    const stored =
        localStorage.getItem(SC_SPENDING_KEY);

    let transactions = [];

    if(stored){

        try{
            transactions = JSON.parse(stored) || [];
        }catch(error){
            transactions = [];
        }

    }

    transactions.unshift({
        id: `spend_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        title: title,
        amount: amount,
        createdAt: Date.now()
    });

    transactions = transactions.slice(0, 100);

    localStorage.setItem(
        SC_SPENDING_KEY,
        JSON.stringify(transactions)
    );

    if(
        typeof renderAppSpendingTransactions ===
        "function"
    ){

        renderAppSpendingTransactions();

    }

    return transactions[0];

}


/* =====================================================
GET SPENDING TRANSACTIONS
===================================================== */

function getAppSpendingTransactions(){

    const stored =
        localStorage.getItem(SC_SPENDING_KEY);

    if(!stored) return [];

    try{
        return JSON.parse(stored) || [];
    }catch(error){
        return [];
    }

}


/* =====================================================
RENDER SPENDING TRANSACTIONS
(SPENDING HISTORY TAB)
===================================================== */

function renderAppSpendingTransactions(){

    const list =
        document.getElementById(
            "app-spending-transactions-list"
        );

    if(!list) return;

    const transactions =
        getAppSpendingTransactions();

    if(!transactions.length){

        list.innerHTML = `

            <div class="game-history-empty">

                <div class="game-history-empty-icon">
                    🔐
                </div>

                <h3>
                    No spending yet
                </h3>

                <p>
                    Coins you spend on reveals, chats,
                    and games will appear here.
                </p>

            </div>

        `;

        return;

    }

    list.innerHTML =
        transactions.map(transaction => `

            <article class="app-transaction-item">

                <span class="app-transaction-icon">
                    🔐
                </span>

                <div>

                    <strong>
                        ${escapePostHTML(transaction.title || "Coins Spent")}
                    </strong>

                    <small>
                        ${formatRewardTimestamp(transaction.createdAt)}
                    </small>

                </div>

                <b class="transaction-negative">
                    -${Number(transaction.amount) || 0} 🪙
                </b>

            </article>

        `).join("");

}



/* =====================================================
GET MUTUAL CRUSHES

Returns every demo crush currently flagged as mutual.
LATER: this is where a real backend call would go.
===================================================== */
function getMutualCrushes(){

    const all = [
        ...SC_DEMO_CRUSHES.filter(
            crush => crush.mutual
        ),
        ...SC_Mutual_GetSenderCrushes()
    ];

    /* newest match first */

    return all.sort(
        (a,b) =>
            (b.matchedAt || 0) -
            (a.matchedAt || 0)
    );

}
/* =====================================================
MUTUAL CRUSH STATE — PERSISTENCE

mutualRevealed / mutualChatUnlocked live on the demo
objects in memory, but need to survive page reloads,
so they're mirrored to localStorage here.
===================================================== */

const MUTUAL_STATE_KEY = "secretCrushMutualState";


function loadMutualCrushState(){

    const stored =
        localStorage.getItem(MUTUAL_STATE_KEY);

    if(!stored) return;

    let state = {};

    try{
        state = JSON.parse(stored) || {};
    }catch(error){
        state = {};
    }

    SC_DEMO_CRUSHES.forEach(crush => {

        if(state[crush.id]){

            crush.mutualRevealed =
                !!state[crush.id].mutualRevealed;

            crush.mutualChatUnlocked =
                !!state[crush.id].mutualChatUnlocked;

            crush.mutualChatUnlockedAt =
                state[crush.id].mutualChatUnlockedAt || 0;

        }

    });

}


function saveMutualCrushState(){

    const state = {};

    SC_DEMO_CRUSHES.forEach(crush => {

        state[crush.id] = {
            mutualRevealed: !!crush.mutualRevealed,
mutualChatUnlocked: !!crush.mutualChatUnlocked,
            mutualChatUnlockedAt: crush.mutualChatUnlockedAt || 0
        
            
        };

    });

    localStorage.setItem(
        MUTUAL_STATE_KEY,
        JSON.stringify(state)
    );

}


loadMutualCrushState();



/* =====================================================
MUTUAL CRUSHES — OPEN / CLOSE
===================================================== */

function openMutualCrushesPage(){

    if(!mutualCrushView) return;

    renderMutualCrushes();

    SC_Activity_MarkAllSeen(
        "mutual",
        getMutualCrushes().map(crush => crush.id)
    );

    SC_ActivityHub_RefreshCounts();

    mutualCrushView.classList.add("active");
    mutualCrushView.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeMutualCrushesPage(){

    if(!mutualCrushView) return;

    mutualCrushView.classList.remove("active");

    mutualCrushView.setAttribute(
        "aria-hidden",
        "true"
    );

    openActivityHub();

}


/* =====================================================
MUTUAL CRUSHES — SHOW A SHORT INLINE MESSAGE

Used instead of alert() so it feels native to the
panel (e.g. "Not enough coins").
===================================================== */

function showMutualCrushMessage(text){

    if(!mutualCrushMessage) return;

    mutualCrushMessage.textContent = text;

    mutualCrushMessage.classList.add("visible");

    clearTimeout(
        showMutualCrushMessage._timer
    );

    showMutualCrushMessage._timer =
        setTimeout(() => {

            mutualCrushMessage.classList.remove(
                "visible"
            );

        }, 2400);

}


/* =====================================================
MUTUAL CRUSHES — RENDER LIST
===================================================== */

function renderMutualCrushes(){

    if(!mutualCrushList) return;

    const mutuals =
        getMutualCrushes().map(SC_Mutual_AsViewer);
        
        
    if(mutualCrushCount){

        mutualCrushCount.textContent =
            mutuals.length
                ? `${mutuals.length} crush${mutuals.length === 1 ? "" : "es"} became mutual`
                : "No mutual crushes yet";

    }

    mutualCrushList.innerHTML = "";

    if(!mutuals.length){

        mutualCrushList.innerHTML = `

            <div class="game-history-empty">

                <div class="game-history-empty-icon">
                    💜
                </div>

                <h3>
                    No mutual crushes yet
                </h3>

                <p>
                    When someone you have a crush on
                    also has a crush on you, they'll
                    show up here.
                </p>

            </div>

        `;

        return;

    }

    mutuals.forEach(crush => {
const card =
            document.createElement("div");

        card.className =
            "mutual-crush-card";
            
            
if(crush.mutualRevealed){

            card.classList.add(
                "mutual-crush-card-clickable"
            );

            /*
             * Set directly on the element (rather than
             * relying only on a later delegated query)
             * so this keeps working even if some other
             * script error interrupts wiring elsewhere.
             */

            card.onclick = event => {

                if(event.target.closest("button")){
                    return;
                }

                openMutualProfilePage(crush.id);

            };

        }


const chatCost =
            SC_Mutual_GetChatCost(crush);

        card.innerHTML = `

            <div class="mutual-crush-photo-column">

                ${
                    crush.mutualRevealed && crush.photo
                        ? `<img src="${crush.photo}" class="mutual-crush-photo" alt="${crush.name}">`
                        : `<div class="mutual-crush-photo hidden-photo">?</div>`
                }

            </div>

            <div class="mutual-crush-details">

                <div class="mutual-crush-name-row">

                    <span class="mutual-crush-name">
                        ${escapePostHTML(SC_Mutual_GetDisplayName(crush))}
                    </span>

                    <span class="mutual-crush-badge">
                        ♡♡ MUTUAL
                    </span>

                </div>

                ${
                    crush.mutualRevealed
                        ? `
                            <div class="mutual-crush-detail-row">
                                <strong>${escapePostHTML(crush.year)}</strong>
                            </div>
                            <div class="mutual-crush-detail-row">
                                <strong>${escapePostHTML(crush.faculty)}, ${escapePostHTML(crush.school)}</strong>
                            </div>
                        `
                        : `
                            <div class="mutual-crush-detail-row">
                                <span class="hidden-value">Profile still hidden</span>
                            </div>
                        `
                }

                <div class="mutual-crush-actions">

                    ${
                        crush.mutualRevealed
? `
    <button
        type="button"
        class="mutual-reveal-button"
        data-mutual-view="${crush.id}"
    >
        VIEW PROFILE
    </button>
`
                            : `
                                <button
                                    type="button"
                                    class="mutual-reveal-button"
                                    data-mutual-reveal="${crush.id}"
                                >
                                    REVEAL PROFILE
                                    <small>${MUTUAL_REVEAL_COST} 🪙</small>
                                </button>
                            `
                    }

                    <button
                        type="button"
                        class="mutual-chat-button"
                        data-mutual-chat="${crush.id}"
                    >
                        ${
                            chatCost === 0
                                ? "OPEN CHAT"
                                : `OPEN CHAT <small>${chatCost} 🪙</small>`
                        }
                    </button>

                </div>

            </div>

        `;

        mutualCrushList.appendChild(card);

    });

    attachMutualCrushButtons();

}


/* =====================================================
MUTUAL CRUSHES — BUTTON HANDLERS
===================================================== */
function attachMutualCrushButtons(){

    mutualCrushList
        .querySelectorAll("[data-mutual-reveal]")
        .forEach(button => {

            button.addEventListener("click", () => {

                attemptMutualReveal(
                    button.dataset.mutualReveal
                );

            });

        });


    mutualCrushList
        .querySelectorAll("[data-mutual-chat]")
        .forEach(button => {

            button.addEventListener("click", () => {

                attemptMutualChat(
                    button.dataset.mutualChat
                );

            });

        });


    

}


/* =====================================================
ATTEMPT: REVEAL A MUTUAL CRUSH'S PROFILE

Pulled out into its own function so it can be called
again automatically after the user tops up coins from
the "Not Enough Coins" modal.
===================================================== */

function attemptMutualReveal(crushId){

    const crush =
        SC_DEMO_CRUSHES.find(
            item => item.id === crushId
        );

    if(!crush) return;

    if(!spendBankCoins(
        MUTUAL_REVEAL_COST,
        `Revealed ${crush.name}'s Profile`
    )){

        openInsufficientCoinsModal(
            MUTUAL_REVEAL_COST,
            () => attemptMutualReveal(crushId)
        );

        return;

    }
crush.mutualRevealed = true;

    saveMutualCrushState();

    renderMutualCrushes();

    openMutualProfilePage(crushId);
    
}


/* =====================================================
ATTEMPT: OPEN CHAT WITH A MUTUAL CRUSH
===================================================== */
function attemptMutualChat(crushId){

    const crush =
        SC_Mutual_FindCrush(crushId);

    if(!crush) return;

    if(crush.mutualChatUnlocked){

        openMutualChatThread(crush);

        return;

    }

    /* 0 when the other person already paid */

    const cost =
        SC_Mutual_GetChatCost(crush);

    if(cost > 0){

        if(!spendBankCoins(
            cost,
            `Opened Chat with ${SC_Mutual_GetDisplayName(crush)}`
        )){

            openInsufficientCoinsModal(
                cost,
                () => attemptMutualChat(crushId)
            );

            return;

        }

        SC_MutualSync.publishChatPaid(
            crush.id
        );

    }

    crush.mutualChatUnlocked = true;

    crush.mutualChatUnlockedAt = Date.now();

    saveMutualCrushState();

    SC_Mutual_SaveSenderMatches();

    renderMutualCrushes();

    openMutualChatThread(crush);

}


function openMutualChatThread(crush){

    if(!crush) return;

    const viewer =
        SC_Mutual_AsViewer(crush);

    ensureChatExists(viewer);

    SC_Mutual_CloseOverlays();

    const chatsNav =
        document.querySelector(
            '.nav-item[data-page="chats"]'
        );

    if(chatsNav){
        chatsNav.click();
    }else{
        renderChatList();
    }

    setTimeout(() => {
        openChatThread(viewer);
    }, 120);

}


/* =====================================================
MUTUAL CRUSH PROFILE — REFERENCES
===================================================== */

const mutualProfileView =
    document.getElementById("mutual-profile-view");

const mutualProfileBackdrop =
    document.getElementById("mutual-profile-backdrop");

const mutualProfileBack =
    document.getElementById("mutual-profile-back");

const mutualProfileContent =
    document.getElementById("mutual-profile-content");
    
    /* =====================================================
MODULE: USER SEARCH + UNIVERSAL PROFILE VIEWER
===================================================== */

const feedSearchButton =
    document.getElementById("feed-search-button");

const feedUserSearchView =
    document.getElementById("feed-user-search-view");

const feedUserSearchBackdrop =
    document.getElementById("feed-user-search-backdrop");

const feedUserSearchBack =
    document.getElementById("feed-user-search-back");

const feedUserSearchInput =
    document.getElementById("feed-user-search-input");

const feedUserSearchClear =
    document.getElementById("feed-user-search-clear");

const feedUserSearchResults =
    document.getElementById("feed-user-search-results");


const SC_USER_SEARCH_RECENT_KEY =
    "secretCrushUserSearchRecent";


function SC_Search_NormalizeText(value){

    return String(value || "")
        .toLowerCase()
        .trim();

}


function SC_Search_Slug(value){

    return SC_Search_NormalizeText(value)
        .replace(/[^a-z0-9]+/g,"-")
        .replace(/^-+|-+$/g,"");

}


function SC_Search_ReadRecent(){

    try{

        const saved =
            JSON.parse(
                localStorage.getItem(
                    SC_USER_SEARCH_RECENT_KEY
                ) || "[]"
            );

        return Array.isArray(saved)
            ? saved
            : [];

    }catch(error){

        return [];

    }

}


function SC_Search_SaveRecent(person){

    const current =
        SC_Search_ReadRecent()
            .filter(
                item =>
                    item.id !== person.id
            );


    current.unshift({

        id:person.id,

        name:person.name,

        username:person.username,

        photo:person.photo,

        school:person.school,

        faculty:person.faculty,

        year:person.year

    });


    localStorage.setItem(
        SC_USER_SEARCH_RECENT_KEY,
        JSON.stringify(
            current.slice(0,6)
        )
    );

}


function SC_Search_ParseAcademicText(text){

    const parts =
        String(text || "")
            .split("•")
            .map(
                part =>
                    part.trim()
            )
            .filter(Boolean);


    let school =
        parts[0] || "";

    let faculty =
        parts.length >= 3
            ? parts[1]
            : "";

    let year = "";


    const yearMatch =
        String(text || "").match(
            /(\+6|[1-6](?:st|nd|rd|th))\s*Year/i
        );


    if(yearMatch){

        year =
            yearMatch[1];

    }


    if(!year && parts.length >= 2){

        year =
            parts[1]
                .replace(
                    /\s*Year/i,
                    ""
                )
                .trim();

    }


    return {
        school,
        faculty,
        year
    };

}


function SC_Search_MakePublicDemoPerson(data){

    const name =
        data.name ||
        "Secret Crush";


    const id =
        data.id ||
        `user-${SC_Search_Slug(name)}`;


    const hasRevealState =
        !!(
            data.revealed ||
            data.revealedFields ||
            data.revealedProfileFields ||
            data.profileFullyRevealed !== undefined ||
            data.revealComplete !== undefined ||
            data.mutualRevealed !== undefined
        );


    return {

        id,

        name,

        username:
            data.username ||
            name,

        photo:
            data.photo ||
            data.profilePicture ||
            "",

        school:
            data.school ||
            data.institution ||
            "",

        faculty:
            data.faculty ||
            "",

        year:
            data.year ||
            "",

        gender:
            data.gender ||
            "",

        about:
            data.about ||
            "",

        interests:
            Array.isArray(data.interests)
                ? [...data.interests]
                : [],

        posts:
            Array.isArray(data.posts)
                ? [...data.posts]
                : [],

        revealed:
            data.revealed ||
            data.revealedFields ||
            data.revealedProfileFields ||
            (
                hasRevealState
                    ? {}
                    : {
                        name:true,
                        school:true,
                        faculty:true,
                        year:true,
                        picture:true,
                        about:true,
                        interests:true,
                        posts:true,
                        moments:true
                    }
            ),

        fullyRevealed:
            hasRevealState
                ? data.fullyRevealed === true
                : data.fullyRevealed !== false

    };

}


function SC_Search_AddUser(
    map,
    person,
    post=null
){

    if(
        !person ||
        !person.name
    ){
        return;
    }


    const key =
        SC_Search_NormalizeText(
            person.id ||
            person.name
        );


    if(!key){
        return;
    }


    if(!map.has(key)){

        map.set(
            key,
            SC_Search_MakePublicDemoPerson(
                person
            )
        );

    }else{

        const existing =
            map.get(key);


        existing.photo =
            existing.photo ||
            person.photo ||
            person.profilePicture ||
            "";


        existing.school =
            existing.school ||
            person.school ||
            person.institution ||
            "";


        existing.faculty =
            existing.faculty ||
            person.faculty ||
            "";


        existing.year =
            existing.year ||
            person.year ||
            "";


        existing.about =
            existing.about ||
            person.about ||
            "";


        if(
            Array.isArray(
                person.interests
            ) &&
            !existing.interests.length
        ){

            existing.interests =
                [...person.interests];

        }

    }


    if(post){

        const existing =
            map.get(key);


        const postKey =
            post.id ||
            `${existing.id}-post-${
                existing.posts.length
            }`;


        if(
            !existing.posts.some(
                item =>
                    item &&
                    item.id === postKey
            )
        ){

            existing.posts.push({

                id:postKey,

                image:
                    post.image ||
                    post.media ||
                    post.photo ||
                    "",

                caption:
                    post.caption ||
                    post.text ||
                    "",

                text:
                    post.text ||
                    "",

                likes:
                    Number(
                        post.likes
                    ) || 0,

                createdAt:
                    post.createdAt ||
                    post.timestamp ||
                    Date.now()

            });

        }

    }

}


function SC_Search_IndexCurrentUsers(){

    const users =
        new Map();


    /* HOMEPAGE RECOMMENDATIONS */

    document
        .querySelectorAll(
            ".recommendation-grid .user-card"
        )
        .forEach(card => {

            const name =
                card.querySelector(
                    "h3"
                )?.textContent?.trim();


            if(!name){
                return;
            }


            const school =
                card.querySelector(
                    "p"
                )?.textContent?.trim() ||
                "";


            const academic =
                card.querySelector(
                    "small"
                )?.textContent?.trim() ||
                "";


            const parsed =
                SC_Search_ParseAcademicText(
                    academic
                );


            SC_Search_AddUser(
                users,
                {

                    name,

                    photo:
                        card.querySelector(
                            "img"
                        )?.src ||
                        "",

                    school,

                    faculty:
                        parsed.faculty,

                    year:
                        parsed.year

                }
            );

        });


    /* FEED POSTS */

    document
        .querySelectorAll(
            ".feed-content .feed-card"
        )
        .forEach(card => {

            const name =
                card.querySelector(
                    ".feed-user-info h3"
                )?.textContent?.trim();


            if(!name){
                return;
            }


            const academicText =
                card.querySelector(
                    ".feed-user-info p"
                )?.textContent?.trim() ||
                "";


            const parsed =
                SC_Search_ParseAcademicText(
                    academicText
                );


            const school =
                card.dataset.school ||
                card.dataset.institution ||
                parsed.school;


            const faculty =
                card.dataset.faculty ||
                parsed.faculty;


            const year =
                card.dataset.year ||
                parsed.year;


            const person = {

                id:
                    card.dataset.userId ||
                    `user-${SC_Search_Slug(name)}`,

                name,

                photo:
                    card.querySelector(
                        ".feed-user-info img"
                    )?.src ||
                    "",

                school,

                faculty,

                year,

                gender:
                    card.dataset.gender ||
                    ""

            };


            const media =
                card.querySelector(
                    ".feed-media img"
                );


            const caption =
                card.querySelector(
                    ".feed-caption"
                )?.textContent?.trim() ||

                card.querySelector(
                    ".feed-post-text"
                )?.textContent?.trim() ||

                "";


            SC_Search_AddUser(
                users,
                person,
                {

                    id:
                        card.dataset.postId ||
                        `${person.id}-feed-post`,

                    image:
                        media?.src ||
                        "",

                    caption,

                    likes:
                        card.querySelector(
".like-action .like-count"
                        )?.textContent ||
                        0

                }
            );

        });


    /* HOME USER POSTS */

    document
        .querySelectorAll(
            ".home-feed-content .home-user-post"
        )
        .forEach(card => {

            const name =
                card.querySelector(
                    ".home-post-user-info h3"
                )?.textContent?.trim();


            if(!name){
                return;
            }


            const academicText =
                card.querySelector(
                    ".home-post-user-info p"
                )?.textContent?.trim() ||
                "";


            const parsed =
                SC_Search_ParseAcademicText(
                    academicText
                );


            SC_Search_AddUser(
                users,
                {

                    id:
                        card.dataset.userId ||
                        `user-${SC_Search_Slug(name)}`,

                    name,

                    photo:
                        card.querySelector(
                            ".home-post-user-info img"
                        )?.src ||
                        "",

                    school:
                        parsed.school,

                    faculty:
                        parsed.faculty,

                    year:
                        parsed.year

                },

                {

                    id:
                        card.dataset.postId,

                    image:
                        card.querySelector(
                            ".home-post-media img"
                        )?.src ||
                        "",

                    caption:
                        card.querySelector(
                            ".home-post-caption"
                        )?.textContent?.trim() ||

                        card.querySelector(
                            ".home-post-text"
                        )?.textContent?.trim() ||

                        ""

                }

            );

        });


    /* HOMEPAGE MOMENT PREVIEW */

    document
        .querySelectorAll(
            ".moment-preview"
        )
        .forEach(card => {

            const name =
                card.querySelector(
                    ".moment-user h3"
                )?.textContent?.trim();


            if(!name){
                return;
            }


            SC_Search_AddUser(
                users,
                {

                    id:
                        `user-${SC_Search_Slug(name)}`,

                    name,

                    photo:
                        card.querySelector(
                            ".moment-user img"
                        )?.src ||
                        "",

                    school:
                        card.querySelector(
                            ".moment-user p"
                        )?.textContent?.trim() ||
                        ""

                },

                {

                    id:
                        `moment-preview-${SC_Search_Slug(name)}`,

                    image:
                        card.querySelector(
                            ".moment-image"
                        )?.src ||
                        "",

                    caption:""

                }

            );

        });


    /* SAVED MOMENTS / REAL USER POSTS */

    try{

        const savedMoments =
            JSON.parse(
                localStorage.getItem(
                    "secretCrushMoments"
                ) || "[]"
            );


        if(Array.isArray(savedMoments)){

            savedMoments.forEach(
                moment => {

                    if(!moment?.name){
                        return;
                    }


                    SC_Search_AddUser(
                        users,
                        {

                            id:
                                moment.userId ||
                                moment.username ||
                                `user-${SC_Search_Slug(moment.name)}`,

                            name:
                                moment.name,

                            username:
                                moment.username ||
                                moment.name,

                            photo:
                                moment.profilePicture ||
                                "",

                            school:
                                moment.institution ||
                                "",

                            faculty:
                                moment.faculty ||
                                "",

                            year:
                                moment.year ||
                                "",

                            gender:
                                moment.gender ||
                                "",

                            about:
                                moment.about ||
                                "",

                            interests:
                                moment.interests ||
                                []

                        },

                        moment

                    );

                }
            );

        }

    }catch(error){

        console.warn(
            "Secret Crush search: could not read saved moments.",
            error
        );

    }


/* =================================================
   CURRENT USER OVERRIDE
   =================================================
   The current user's profile is ALWAYS authoritative.

   This prevents an old post from becoming the
   "identity" used by Search.
   ================================================= */

const currentProfile =
    getCurrentProfile();


if(currentProfile){

    const currentUserId =
        currentProfile.userId;


    const canonicalUser =
        SC_Search_MakePublicDemoPerson({

            id:
                currentUserId,

            name:
                currentProfile.name,

            username:
                currentProfile.username ||
                currentProfile.name,

            photo:
                currentProfile.profilePicture,

            school:
                currentProfile.institution,

            faculty:
                currentProfile.faculty,

            year:
                currentProfile.year,

            gender:
                currentProfile.gender,

            about:
                currentProfile.about,

            interests:
                currentProfile.interests

        });


    /*
     * Rebuild this user's posts from storage
     * using the permanent owner ID.
     */

    try{

        const savedMoments =
            JSON.parse(
                localStorage.getItem(
                    "secretCrushMoments"
                ) || "[]"
            );


        if(Array.isArray(savedMoments)){

            canonicalUser.posts =
                savedMoments

                    .filter(
                        post =>
                            post.ownerId ===
                                currentUserId ||

                            (
                                post.isUserPost === true &&
                                !post.ownerId
                            )
                    )

                    .map(
                        post =>
                            SC_ProfileSync_HydratePost(
                                post
                            )
                    );

        }

    }catch(error){

        canonicalUser.posts = [];

    }


    users.set(
        currentUserId,
        canonicalUser
    );

}


return Array.from(
    users.values()
);

}




function SC_Search_UserCardHTML(person){

    const photo =
        person.photo ||

        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%2314141d'/%3E%3Ctext x='50' y='58' text-anchor='middle' fill='%23ffffff' font-size='40'%3E?%3C/text%3E%3C/svg%3E";


    const school =
        person.school ||
        "Institution hidden";


    const academic = [

        person.year
            ? `${person.year} Year`
            : "",

        person.faculty ||
        ""

    ]
        .filter(Boolean)
        .join(" • ");


    return `

        <button
            type="button"
            class="sc-search-user-card"
            data-search-user-id="${escapePostHTML(
                person.id
            )}"
        >

            <img
                src="${escapePostHTML(
                    photo
                )}"
                alt=""
                class="sc-search-user-photo"
            >


            <span
                class="sc-search-user-copy"
            >

                <strong>
                    ${escapePostHTML(
                        person.name
                    )}
                </strong>


                <small>
                    ${escapePostHTML(
                        school
                    )}
                </small>


                ${
                    academic

                        ?

                        `
                        <small
                            class="sc-search-user-academic"
                        >
                            ${escapePostHTML(
                                academic
                            )}
                        </small>
                        `

                        :

                        ""
                }

            </span>


            <span
                class="sc-search-user-arrow"
            >
                ›
            </span>

        </button>

    `;

}


function SC_Search_AttachUserResults(){

    feedUserSearchResults
        ?.querySelectorAll(
            "[data-search-user-id]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset
                            .searchUserId;


                    const person =
                        SC_Search_IndexCurrentUsers()
                            .find(
                                item =>
                                    item.id === id
                            );


                    if(!person){
                        return;
                    }


                    SC_Search_SaveRecent(
                        person
                    );


                    openSecretCrushUserProfile(
                        person
                    );

                }
            );

        });

}


function SC_Search_RenderUsers(
    query=""
){

    if(!feedUserSearchResults){
        return;
    }


    const normalizedQuery =
        SC_Search_NormalizeText(
            query
        );


    const users =
        SC_Search_IndexCurrentUsers();


    if(!normalizedQuery){

        const recent =
            SC_Search_ReadRecent();


        feedUserSearchResults.innerHTML = `

            <section
                class="sc-search-section"
            >

                <h3>
                    Recent searches
                </h3>


                <div
                    class="sc-search-recent-list"
                >

                    ${
                        recent.length

                            ?

                            recent
                                .map(
                                    person => `
                                        <button
                                            type="button"
                                            class="sc-search-recent-chip"
                                            data-search-user-id="${escapePostHTML(
                                                person.id
                                            )}"
                                        >
                                            ${escapePostHTML(
                                                person.name
                                            )}
                                        </button>
                                    `
                                )
                                .join("")

                            :

                            `
                            <span
                                class="sc-search-muted"
                            >
                                Your recent searches
                                will appear here.
                            </span>
                            `
                    }

                </div>

            </section>


            <section
                class="sc-search-section"
            >

                <h3>
                    Suggested users
                </h3>


                <div
                    class="sc-search-user-list"
                >

                    ${
                        users
                            .slice(0,6)
                            .map(
                                person =>
                                    SC_Search_UserCardHTML(
                                        person
                                    )
                            )
                            .join("")
                    }

                </div>

            </section>

        `;


        SC_Search_AttachUserResults();

        return;

    }


    const matches =
        users.filter(
            person => {

                const name =
                    SC_Search_NormalizeText(
                        person.name
                    );


                const username =
                    SC_Search_NormalizeText(
                        person.username
                    );


                return (
                    name.includes(
                        normalizedQuery
                    ) ||

                    username.includes(
                        normalizedQuery
                    )
                );

            }
        );


    if(!matches.length){

        feedUserSearchResults.innerHTML = `

            <div
                class="sc-search-no-results"
            >

                <div
                    class="sc-search-no-results-icon"
                >
                    ⌕
                </div>


                <strong>
                    No users found
                </strong>


                <p>
                    We couldn't find anyone
                    matching
                    "${escapePostHTML(
                        query
                    )}".
                    Try a different name
                    or check your spelling.
                </p>

            </div>

        `;

        return;

    }


    feedUserSearchResults.innerHTML = `

        <section
            class="sc-search-section"
        >

            <h3>
                Search results
                (${matches.length})
            </h3>


            <div
                class="sc-search-user-list"
            >

                ${
                    matches
                        .map(
                            person =>
                                SC_Search_UserCardHTML(
                                    person
                                )
                        )
                        .join("")
                }

            </div>

        </section>

    `;


    SC_Search_AttachUserResults();

}


function openFeedUserSearch(){

    if(!feedUserSearchView){
        return;
    }


    feedUserSearchView.classList.add(
        "active"
    );

    feedUserSearchView.setAttribute(
        "aria-hidden",
        "false"
    );


    if(feedUserSearchInput){

        feedUserSearchInput.value =
            "";

        if(feedUserSearchClear){
            feedUserSearchClear.hidden =
                true;
        }


        SC_Search_RenderUsers("");


        setTimeout(
            () => {

                feedUserSearchInput.focus();

            },
            80
        );

    }

}


function closeFeedUserSearch(){

    if(!feedUserSearchView){
        return;
    }


    feedUserSearchView.classList.remove(
        "active"
    );

    feedUserSearchView.setAttribute(
        "aria-hidden",
        "true"
    );

}


function openSecretCrushUserProfile(
    person
){

    if(
        !person ||
        !mutualProfileView
    ){
        return;
    }


    const normalized =
        SC_Search_MakePublicDemoPerson(
            person
        );


    renderMutualProfileContent(
        normalized,
        {
            mode:"public"
        }
    );


    mutualProfileView.classList.add(
        "active"
    );

    mutualProfileView.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* SEARCH OPEN / CLOSE */

feedSearchButton?.addEventListener(
    "click",
    openFeedUserSearch
);


feedUserSearchBack?.addEventListener(
    "click",
    closeFeedUserSearch
);


feedUserSearchBackdrop?.addEventListener(
    "click",
    closeFeedUserSearch
);


feedUserSearchInput?.addEventListener(
    "input",
    () => {

        const value =
            feedUserSearchInput
                .value
                .trim();


        if(feedUserSearchClear){

            feedUserSearchClear.hidden =
                !value;

        }


        SC_Search_RenderUsers(
            value
        );

    }
);


feedUserSearchClear?.addEventListener(
    "click",
    () => {

        if(!feedUserSearchInput){
            return;
        }


        feedUserSearchInput.value =
            "";

        feedUserSearchClear.hidden =
            true;

        feedUserSearchInput.focus();


        SC_Search_RenderUsers(
            ""
        );

    }
);


/* =====================================================
PROFILE OPENING FROM FEED / HOMEPAGE
===================================================== */

document.addEventListener(
    "click",
    event => {

        const trigger =
            event.target.closest(
                ".feed-user-info img, " +
                ".feed-user-info h3, " +
                ".moment-user img, " +
                ".moment-user h3, " +
                ".home-post-user-info img, " +
                ".home-post-user-info h3, " +
                ".user-card > img, " +
                ".user-card-info h3"
            );


        if(!trigger){
            return;
        }


        const feedCard =
            trigger.closest(
                ".feed-card"
            );


        const homePost =
            trigger.closest(
                ".home-user-post"
            );


        const momentPreview =
            trigger.closest(
                ".moment-preview"
            );


        const recommendation =
            trigger.closest(
                ".user-card"
            );


        let name = "";
        let photo = "";
        let school = "";
        let faculty = "";
        let year = "";
        let post = null;


        if(feedCard){

            name =
                feedCard.querySelector(
                    ".feed-user-info h3"
                )?.textContent?.trim() ||
                "";


            photo =
                feedCard.querySelector(
                    ".feed-user-info img"
                )?.src ||
                "";


            const academic =
                feedCard.querySelector(
                    ".feed-user-info p"
                )?.textContent?.trim() ||
                "";


            const parsed =
                SC_Search_ParseAcademicText(
                    academic
                );


            school =
                feedCard.dataset.school ||
                feedCard.dataset.institution ||
                parsed.school;


            faculty =
                feedCard.dataset.faculty ||
                parsed.faculty;


            year =
                feedCard.dataset.year ||
                parsed.year;


            post = {

                id:
                    feedCard.dataset.postId,

                image:
                    feedCard.querySelector(
                        ".feed-media img"
                    )?.src ||
                    "",

                caption:
                    feedCard.querySelector(
                        ".feed-caption"
                    )?.textContent?.trim() ||

                    feedCard.querySelector(
                        ".feed-post-text"
                    )?.textContent?.trim() ||

                    "",

                likes:
                    feedCard.querySelector(
                        ".like-action .like-count"
                    )?.textContent ||
                    0

            };

        }


        else if(homePost){

            name =
                homePost.querySelector(
                    ".home-post-user-info h3"
                )?.textContent?.trim() ||
                "";


            photo =
                homePost.querySelector(
                    ".home-post-user-info img"
                )?.src ||
                "";


            const parsed =
                SC_Search_ParseAcademicText(
                    homePost.querySelector(
                        ".home-post-user-info p"
                    )?.textContent ||
                    ""
                );


            school =
                parsed.school;

            faculty =
                parsed.faculty;

            year =
                parsed.year;


            post = {

                id:
                    homePost.dataset.postId,

                image:
                    homePost.querySelector(
                        ".home-post-media img"
                    )?.src ||
                    "",

                caption:
                    homePost.querySelector(
                        ".home-post-caption"
                    )?.textContent?.trim() ||

                    homePost.querySelector(
                        ".home-post-text"
                    )?.textContent?.trim() ||

                    ""

            };

        }


        else if(momentPreview){

            name =
                momentPreview.querySelector(
                    ".moment-user h3"
                )?.textContent?.trim() ||
                "";


            photo =
                momentPreview.querySelector(
                    ".moment-user img"
                )?.src ||
                "";


            school =
                momentPreview.querySelector(
                    ".moment-user p"
                )?.textContent?.trim() ||
                "";


            post = {

                id:
                    `moment-preview-${SC_Search_Slug(name)}`,

                image:
                    momentPreview.querySelector(
                        ".moment-image"
                    )?.src ||
                    "",

                caption:""

            };

        }


        else if(recommendation){

            name =
                recommendation.querySelector(
                    "h3"
                )?.textContent?.trim() ||
                "";


            photo =
                recommendation.querySelector(
                    "img"
                )?.src ||
                "";


            school =
                recommendation.querySelector(
                    "p"
                )?.textContent?.trim() ||
                "";


            const parsed =
                SC_Search_ParseAcademicText(
                    recommendation.querySelector(
                        "small"
                    )?.textContent ||
                    ""
                );


            faculty =
                parsed.faculty;

            year =
                parsed.year;

        }


        if(!name){
            return;
        }


        const users =
            SC_Search_IndexCurrentUsers();


        const person =
            users.find(
                item =>
                    SC_Search_NormalizeText(
                        item.name
                    ) ===
                    SC_Search_NormalizeText(
                        name
                    )
            ) ||

            SC_Search_MakePublicDemoPerson({

                id:
                    `user-${SC_Search_Slug(name)}`,

                name,

                photo,

                school,

                faculty,

                year,

                posts:
                    post
                        ? [post]
                        : []

            });


        if(
            post &&
            !person.posts.some(
                item =>
                    item?.id === post.id
            )
        ){

            person.posts.push(
                post
            );

        }


        openSecretCrushUserProfile(
            person
        );

    }
);
    
    
    /* =====================================================
PROFILE → SEND CRUSH / SECRET NOTE
===================================================== */

function SC_OpenProfileSendComposer(
    type,
    person
){

    if(
        !person ||
        typeof openSendRevealModal !== "function"
    ){
        return;
    }


    /*
     * The existing Secret Crush composer expects
     * a feed-style article. We create a temporary
     * profile article containing the same information.
     *
     * This means the existing composer can be reused
     * instead of creating a second Secret Note /
     * Secret Crush system.
     */

    const article =
        document.createElement("article");


    article.dataset.postId =
        person.id;


    article.innerHTML = `

        <div class="feed-user-info">

            <img
                src="${escapePostHTML(
                    person.photo || ""
                )}"
                alt=""
            >

            <div>

                <h3>
                    ${escapePostHTML(
                        person.name ||
                        "Secret Crush"
                    )}
                </h3>

                <p>
                    ${escapePostHTML(
                        person.school || ""
                    )}
                    •
                    ${escapePostHTML(
                        person.faculty || ""
                    )}
                    •
                    ${escapePostHTML(
                        person.year || ""
                    )}
                </p>

            </div>

        </div>

    `;


    openSendRevealModal(
        type,
        article
    );

}




/* =====================================================
MUTUAL CRUSH PROFILE — OPEN / CLOSE
===================================================== */

function openMutualProfilePage(crushId){

    const crush =
        SC_Mutual_FindCrush(crushId);

    if(
        !crush ||
        !mutualProfileView
    ){
        return;
    }


    /*
     * IMPORTANT:
     *
     * We pass the ORIGINAL crush object here.
     * The profile renderer decides what information
     * the viewer is allowed to see.
     */

    renderMutualProfileContent(
        crush
    );


    mutualProfileView.classList.add(
        "active"
    );

    mutualProfileView.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeMutualProfilePage(){

    if(!mutualProfileView){
        return;
    }


        mutualProfileView.classList.remove(
        "active",
        "sc-profile-over-viewer"
    );

    mutualProfileView.setAttribute(
        "aria-hidden",
        "true"
    );


    closeMutualPostViewer();

}


/* =====================================================
PROFILE VIEW — ACCESS HELPERS
===================================================== */

function SC_ProfileViewerKnowsPerson(crush){

    if(!crush){
        return false;
    }


    /*
     * A mutual crush means both people have
     * revealed themselves to each other.
     */

  if(
        crush.mutual &&
        !crush.viaReverse
    ){
        return true;
    }
    


    /*
     * These flags allow the future game system
     * to unlock the same known-person profile
     * after a completed Guess My Crush game.
     */

    if(crush.gameCompleted){
        return true;
    }


    if(crush.profileKnown){
        return true;
    }


    return false;

}


function SC_ProfileCanSeeField(
    crush,
    field,
    knownPerson
){

    if(knownPerson){
        return true;
    }


    return !!(
        crush &&
        crush.revealed &&
        crush.revealed[field]
    );

}


function SC_ProfileGetPhoto(
    crush,
    knownPerson
){

    if(!crush){
        return "";
    }


    if(knownPerson){
        return (
            crush.photo ||
            crush.profilePicture ||
            ""
        );
    }


    if(
        crush.revealed &&
        crush.revealed.photo
    ){

        return (
            crush.photo ||
            crush.profilePicture ||
            ""
        );

    }


    return "";

}


/* =====================================================
PROFILE VIEW — POST VIEWER
===================================================== */

let mutualPostViewer =
    null;


function createMutualPostViewer(){

    if(mutualPostViewer){
        return mutualPostViewer;
    }


    mutualPostViewer =
        document.createElement(
            "div"
        );

    mutualPostViewer.className =
        "mutual-post-viewer";


    mutualPostViewer.setAttribute(
        "aria-hidden",
        "true"
    );


    mutualPostViewer.innerHTML = `

        <div
            class="mutual-post-viewer-backdrop"
            data-close-mutual-post-viewer
        ></div>


        <section
            class="mutual-post-viewer-panel"
            role="dialog"
            aria-modal="true"
            aria-label="View post"
        >

            <button
                type="button"
                class="mutual-post-viewer-close"
                data-close-mutual-post-viewer
                aria-label="Close"
            >
                ×
            </button>


            <div
                class="mutual-post-viewer-counter"
                id="mutual-post-viewer-counter"
            ></div>


            <div
                class="mutual-post-viewer-media"
                id="mutual-post-viewer-media"
            ></div>


            <div
                class="mutual-post-viewer-info"
            >

                <button
                    type="button"
                    class="mutual-post-viewer-like"
                    id="mutual-post-viewer-like"
                >
                    ♡
                    <span id="mutual-post-viewer-like-count">
                        0
                    </span>
                </button>


                <div
                    class="mutual-post-viewer-caption"
                    id="mutual-post-viewer-caption"
                ></div>

            </div>

        </section>

    `;


    document.body.appendChild(
        mutualPostViewer
    );


    mutualPostViewer
        .querySelectorAll(
            "[data-close-mutual-post-viewer]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                closeMutualPostViewer
            );

        });


    document.addEventListener(
        "keydown",
        event => {

            if(
                event.key === "Escape" &&
                mutualPostViewer &&
                mutualPostViewer.classList.contains(
                    "active"
                )
            ){

                closeMutualPostViewer();

            }

        }
    );


    return mutualPostViewer;

}


function openMutualPostViewer(
    crush,
    post,
    index,
    total
){

    if(!post){
        return;
    }


    const viewer =
        createMutualPostViewer();


    const media =
        viewer.querySelector(
            "#mutual-post-viewer-media"
        );

    const caption =
        viewer.querySelector(
            "#mutual-post-viewer-caption"
        );

    const counter =
        viewer.querySelector(
            "#mutual-post-viewer-counter"
        );

    const likeButton =
        viewer.querySelector(
            "#mutual-post-viewer-like"
        );

    const likeCount =
        viewer.querySelector(
            "#mutual-post-viewer-like-count"
        );


    const image =
        post.image ||
        post.media ||
        post.photo ||
        "";


    if(image){

        media.innerHTML = `

            <img
                src="${escapePostHTML(image)}"
                alt=""
            >

        `;

    }else{

        media.innerHTML = `

            <div
                class="mutual-post-viewer-placeholder"
            >
                ${escapePostHTML(
                    post.emoji ||
                    "📷"
                )}
            </div>

        `;

    }


    counter.textContent =
        `${Number(index) + 1} / ${Number(total) || 1}`;


    caption.innerHTML = `

        <strong>
            ${escapePostHTML(
                crush.username ||
                crush.name ||
                "Secret Crush"
            )}
        </strong>

        <p>
            ${escapePostHTML(
                post.caption ||
                post.text ||
                ""
            )}
        </p>

    `;


    let likes =
        Number(post.likes) || 0;


    likeCount.textContent =
        likes;


    likeButton.classList.remove(
        "liked"
    );


    likeButton.onclick = () => {

        likes++;

        post.likes =
            likes;

        likeCount.textContent =
            likes;

        likeButton.classList.add(
            "liked"
        );

    };


    viewer.classList.add(
        "active"
    );

    viewer.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeMutualPostViewer(){

    if(!mutualPostViewer){
        return;
    }


    mutualPostViewer.classList.remove(
        "active"
    );

    mutualPostViewer.setAttribute(
        "aria-hidden",
        "true"
    );

}
/* =========================================
   PROFILE REVEAL / VISIBILITY ENGINE

   Following someone does NOT unlock anything.

   A person's visibility is determined by:
   1. Their actual reveal state.
   2. Whether the viewer genuinely knows them
      through a mutual crush / completed game.
   ========================================= */

function SC_Profile_GetRevealState(person){

    if(!person){

        return {

            name:false,
            school:false,
            faculty:false,
            year:false,
            picture:false,
            about:false,
            interests:false,
            posts:false,
            fullyRevealed:false

        };

    }


    const revealedFields =
        person.revealed &&
        typeof person.revealed === "object"

            ?

            person.revealed

            :

            (
                person.revealedFields &&
                typeof person.revealedFields === "object"

                    ?

                    person.revealedFields

                    :

                    (
                        person.revealedProfileFields &&
                        typeof person.revealedProfileFields === "object"

                            ?

                            person.revealedProfileFields

                            :

                            {}
                    )
            );


    const readField = (field) => {

        return (
            revealedFields[field] === true ||
            revealedFields[field] === "true"
        );

    };


    /*
     * In the current Secret Crush reveal system,
     * these four fields represent the core identity:
     *
     * name
     * school
     * faculty
     * year
     *
     * If all four are revealed, the identity is
     * considered fully revealed even if there is
     * no separate "fullyRevealed" flag yet.
     */

    const identityFullyRevealed =

        readField("name") &&
        (
            readField("school") ||
            readField("institution")
        ) &&
        readField("faculty") &&
        readField("year");


    const fullyRevealed =

        person.fullyRevealed === true ||

        person.profileFullyRevealed === true ||

        person.revealComplete === true ||

        person.mutualRevealed === true ||

        identityFullyRevealed;


    return {

        name:
            fullyRevealed ||
            readField("name") ||
            readField("username"),


        school:
            fullyRevealed ||
            readField("school") ||
            readField("institution"),


        faculty:
            fullyRevealed ||
            readField("faculty"),


        year:
            fullyRevealed ||
            readField("year"),


        picture:
            fullyRevealed ||
            readField("picture") ||
            readField("profilePicture") ||
            readField("photo"),


        about:
            fullyRevealed ||
            readField("about"),


        interests:
            fullyRevealed ||
            readField("interests"),


        posts:
            fullyRevealed ||
            readField("posts") ||
            readField("moments"),


        fullyRevealed

    };

}


/* =====================================================
MODULE: FACULTY PROFILE THEME MAPPING
Maps existing faculty options to CSS themes.
===================================================== */

function SC_GetFacultyThemeCategory(faculty) {

    const value = String(faculty || "")
        .trim()
        .toLowerCase();

    const categories = {
        health: [
            "health sciences",
            "medicine",
            "nursing",
            "pharmacy"
        ],

        technology: [
            "engineering",
            "computing & it"
        ],

        business: [
            "accounting",
            "administration",
            "business",
            "economics",
            "finance",
            "hospitality & tourism",
            "human resources",
            "marketing",
            "procurement",
            "real estate"
        ],

        learning: [
            "education",
            "humanities",
            "communication & media",
            "film",
            "journalism"
        ],

        built: [
            "architecture & design",
            "quantity surveying"
        ],

        environment: [
            "agriculture",
            "environmental studies"
        ],

        science: [
            "science"
        ],

        society: [
            "development studies",
            "law",
            "political science",
            "psychology",
            "public administration",
            "social sciences",
            "sociology"
        ]
    };

    for (const [category, faculties] of Object.entries(categories)) {
        if (faculties.includes(value)) {
            return category;
        }
    }

    return "general";
}




/* =====================================================
MUTUAL CRUSH PROFILE — RENDER
===================================================== */
function renderMutualProfileContent(crush, options={}) {

    const mode = options.mode || "mutual";

    /*
     * IMPORTANT:
     * Following/follower status does NOT determine
     * profile visibility.
     *
     * Visibility comes from the actual reveal state.
     */
    const revealState = SC_Profile_GetRevealState(crush);

    const isFullyRevealed =
        revealState.fullyRevealed;

    const isPartiallyRevealed =
        !isFullyRevealed &&
        (
            revealState.name ||
            revealState.school ||
            revealState.faculty ||
            revealState.year ||
            revealState.picture ||
            revealState.about ||
            revealState.interests
        );
        


const knownPerson =
    SC_ProfileViewerKnowsPerson(
        crush
    );


/*
 * Following/follower status does NOT make
 * someone a known person.
 *
 * These permissions come only from:
 *
 * - an actual mutual/known relationship, OR
 * - the person's own reveal state.
 */

const canSeeName =
    knownPerson ||
    revealState.name;


const canSeeSchool =
    knownPerson ||
    revealState.school;


const canSeeFaculty =
    knownPerson ||
    revealState.faculty;


const canSeeYear =
    knownPerson ||
    revealState.year;


const canSeePicture =
    knownPerson ||
    revealState.picture;


const canSeeAbout = true;

const canSeeInterests =
    knownPerson ||
    revealState.interests;


const canSeePosts =
    knownPerson ||
    revealState.posts;


/*
 * INTERESTS
 */

const interests =

    canSeeInterests &&
    Array.isArray(
        crush.interests
    )

        ?

        crush.interests

        :

        [];


/*
 * POSTS / MOMENTS
 *
 * These stay hidden until the person is
 * genuinely known or fully reveals them.
 */

const posts =

    canSeePosts &&
    Array.isArray(
        crush.posts
    )

        ?

        crush.posts

        :

        [];


/*
 * ABOUT
 */

const about = SC_Profile_ResolveAbout(crush);

/*
 * PROFILE PICTURE
 */

const photo =

    canSeePicture

        ?

        (
            crush.photo ||
            crush.profilePicture ||
            ""
        )

        :

        "";


/*
 * VIEWER-ASSIGNED NAME
 *
 * If the real name is hidden, preserve the
 * name the viewer previously assigned.
 */

let assignedName = "";


try{

    const savedNames =
        typeof getCrushNames === "function"

            ?

            getCrushNames()

            :

            {};


    assignedName =
        savedNames[crush.id] ||
        "";

}catch(error){

    assignedName =
        "";

}


const username =

    canSeeName

        ?

        (
            crush.username ||
            crush.name ||
            "Secret Crush"
        )

        :

        (
            assignedName ||
            crush.customName ||
            crush.alias ||
            crush.displayName ||
            "Mystery"
        );


/*
 * PROFILE DETAILS
 */

const displayedSchool =

    canSeeSchool

        ?

        (
            crush.school ||
            crush.institution ||
            "School hidden"
        )

        :

        "School hidden";


const displayedFaculty =

    canSeeFaculty

        ?

        (
            crush.faculty ||
            "Faculty hidden"
        )

        :

        "Faculty hidden";


const displayedYear =

    canSeeYear

        ?

        (
            crush.year ||
            "Year hidden"
        )

        :

        "Year hidden";
        


    const chatCost =
        mode === "mutual"
            ? SC_Mutual_GetChatCost(crush)
            : 0;


    const currentlyFollowing =
        SC_ProfileNetwork_IsFollowing(
            crush.id
        );


    const safeFaculty =
        String(
            crush.faculty ||
            "faculty"
        )
        .toLowerCase()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        );
        
        
const facultyThemeCategory =
    SC_GetFacultyThemeCategory(
        crush.faculty
    );



    mutualProfileContent.innerHTML = `

        <!-- PROFILE CARD -->

        <section
            class="
                mutual-profile-card
                faculty-profile-card
            "
        >

<!-- FACULTY WALLPAPER SPACE -->


<div
    class="
        mutual-profile-cover
        faculty-profile-background
    "
    data-faculty="${escapePostHTML(
        safeFaculty
    )}"
    data-faculty-category="${facultyThemeCategory}"
>
</div>



<div
    class="mutual-profile-card-body"
>

    <div
        class="mutual-profile-hero-top"
    >

        <div
            class="mutual-profile-photo-wrap"
        >

            <div
                class="mutual-profile-photo"
            >

                ${
                    photo

                    ?

                    `
                    <img
                        src="${escapePostHTML(
                            photo
                        )}"
                        alt=""
                    >
                    `

                    :

                    `
                    <span>
                        ?
                    </span>
                    `
                }

            </div>

        </div>


        ${
            about

            ?

            `
            <p
                class="mutual-profile-about-chip"
            >
                ${escapePostHTML(
                    about
                )}
            </p>
            `

            :

            ""
        }

    </div>


    <div
        class="mutual-profile-top-details"
    >

        <span
            class="mutual-profile-username"
        >
            ${escapePostHTML(
                username
            )}
        </span>


        <span
            class="mutual-profile-line"
        >
            🎓
            ${escapePostHTML(
                displayedSchool
            )}
        </span>


        <span
            class="mutual-profile-line"
        >
            📚
            ${escapePostHTML(
                displayedFaculty
            )}
        </span>


        <span
            class="mutual-profile-line"
        >
            🗓
            ${escapePostHTML(
                displayedYear
            )}
        </span>

    </div>

</div>

</section>


        <!-- INTERESTS -->

        ${
            interests.length

            ?

            `

            <section
                class="mutual-profile-section"
            >

                <h3
                    class="
                        mutual-profile-section-title
                    "
                >

                    <span>
                        ✦
                    </span>

                    Interests

                </h3>


                <div
                    class="mutual-profile-interests"
                >

                    ${
                        interests
                            .map(
                                interest => `

                                    <span
                                        class="profile-interest"
                                    >
                                        ${escapePostHTML(
                                            interest
                                        )}
                                    </span>

                                `
                            )
                            .join("")
                    }

                </div>

            </section>

            `

            :

            ""
        }


        <!-- ACTION BUTTONS -->

        <div
            class="mutual-profile-actions-row"
        >

            ${
                mode === "mutual"

                ?

                `

                <button
                    type="button"
                    class="profile-action-button"
                    id="mutual-profile-chat-button"
                >

                    <span>
                        💬
                    </span>

                    ${
                        chatCost === 0

                        ?

                        "Open Chat"

                        :

                        `Open Chat · ${chatCost} 🪙`
                    }

                </button>

                `

                :

                ""
            }


            <button
                type="button"
                class="profile-action-button"
                id="mutual-profile-follow-button"
            >

                <span>
                    ${
                        currentlyFollowing
                            ? "✓"
                            : "＋"
                    }
                </span>

                ${
                    currentlyFollowing
                        ? "Unfollow"
                        : "Follow"
                }

            </button>


            <button
                type="button"
                class="profile-action-button"
                id="mutual-profile-gift-button"
            >

                <span>
                    🎁
                </span>

                Send Gift

            </button>

        </div>


        <!-- SECRET NOTE / SECRET CRUSH -->

        ${
            mode !== "mutual"

            ?

            `

            <div
                class="mutual-profile-private-actions"
            >

                <button
                    type="button"
                    class="profile-private-action"
                    id="mutual-profile-secret-note-button"
                >

                    <span>
                        ✉
                    </span>

                    <strong>
                        Send a Secret Note
                    </strong>

                    <small>
                        Drop a little mystery in their inbox.
                    </small>

                </button>


                <button
                    type="button"
                    class="profile-private-action"
                    id="mutual-profile-secret-crush-button"
                >

                    <span>
                        ♡
                    </span>

                    <strong>
                        Send a Secret Crush
                    </strong>

                    <small>
                        Let them know someone is thinking of them.
                    </small>

                </button>

            </div>

            `

            :

            ""
        }


        <!-- MOMENTS & POSTS -->

        ${
            posts.length

            ?

            `

            <section
                class="
                    mutual-profile-section
                    mutual-profile-post-section
                "
            >

                <h3
                    class="
                        mutual-profile-section-title
                    "
                >

                    <span>
                        ▣
                    </span>

                    Moments &amp; Posts

                </h3>


                <div
                    class="mutual-profile-posts-grid"
                >

                    ${
                        posts
    .map(
        (
            post,
            index
        ) => {

            post =
                SC_Moment_ApplyLikeState(
                    {
                        ...post,

                        id:
                            SC_Moment_GetStablePostId(
                                post,
                                crush.id,
                                index
                            )
                    },
                    crush.id,
                    index
                );


            return `
            

                             <article
    class="
        mutual-profile-post-card
    "
    data-mutual-post-index="${index}"
    data-mutual-post-id="${escapePostHTML(post.id || "")}"
>



                                        <div
                                            class="
                                                mutual-profile-post-media
                                            "
                                        >

                                            ${
                                                post.image ||
                                                post.media ||
                                                post.photo

                                                ?

                                                `
                                                <img
                                                    src="${escapePostHTML(
                                                        post.image ||
                                                        post.media ||
                                                        post.photo
                                                    )}"
                                                    alt=""
                                                >
                                                `

                                                :

                                                `
                                                <span>
                                                    ${escapePostHTML(
                                                        post.emoji ||
                                                        "📷"
                                                    )}
                                                </span>
                                                `
                                            }


                             <div
    class="
        mutual-profile-post-likes
    "
>
    ♥
    <span class="mutual-profile-post-likes-count">
        ${
            Number(
                post.likes
            ) || 0
        }
    </span>
</div>


                                        </div>


                                 <div
    class="
        mutual-profile-post-caption
    "
>

    ${escapePostHTML(
        post.caption ||
        post.text ||
        ""
    )}


    <small
        class="
            mutual-profile-post-date
        "
    >
        ${
            post.createdAt
                ? SC_Moment_FormatDateTime(
                    post.createdAt
                )
                : "Date unavailable"
        }
    </small>

</div>

</article>

`;

        }
    )
    .join("")
                    }
                    

                </div>

            </section>

            `

            :

            ""
        }

    `;


    /* OPEN CHAT */

    const chatButton =
        document.getElementById(
            "mutual-profile-chat-button"
        );


    if(chatButton){

        chatButton.addEventListener(
            "click",
            () =>
                attemptMutualChat(
                    crush.id
                )
        );

    }


    /* FOLLOW / UNFOLLOW */

    const followButton =
        document.getElementById(
            "mutual-profile-follow-button"
        );


    if(followButton){

        followButton.addEventListener(
            "click",
            () => {

                if(
                    SC_ProfileNetwork_IsFollowing(
                        crush.id
                    )
                ){

                    SC_ProfileNetwork_Unfollow(
                        crush.id
                    );
}else{

                    SC_ProfileNetwork_Follow({
                        id: crush.id,
                        name: username,
                        username: username,
                        photo: photo,
                        school: displayedSchool,
                        faculty: displayedFaculty,
                        year: displayedYear
                    });

                }
                


                renderMutualProfileContent(
                    crush,
                    {
                        mode:
                            mode === "mutual"

                            ?

                            "mutual"

                            :

                            (
                                SC_ProfileNetwork_IsFollowing(
                                    crush.id
                                )

                                    ?

                                    "following"

                                    :

                                    mode
                            )
                    }
                );

            }
        );

    }


    /* SEND GIFT */

    const giftButton =
        document.getElementById(
            "mutual-profile-gift-button"
        );


    if(giftButton){

        giftButton.addEventListener(
            "click",
            () => {

                showSCMessage({

                    type:"INFORMATION",

                    title:"Send Gift",

                    message:
                        "The gift system will be connected here."

                });

            }
        );

    }

/* SECRET NOTE */

const secretNoteButton =
    document.getElementById(
        "mutual-profile-secret-note-button"
    );


if(secretNoteButton){

    secretNoteButton.addEventListener(
        "click",
        () => {

            SC_OpenProfileSendComposer(
                "note",
                crush
            );

        }
    );

}


/* SECRET CRUSH */

const secretCrushButton =
    document.getElementById(
        "mutual-profile-secret-crush-button"
    );


if(secretCrushButton){

    secretCrushButton.addEventListener(
        "click",
        () => {

            SC_OpenProfileSendComposer(
                "crush",
                crush
            );

        }
    );

}




    /* OPEN POSTS */

    mutualProfileContent
        .querySelectorAll(
            "[data-mutual-post-index]"
        )
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            card.dataset
                                .mutualPostIndex
                        );


                    const post =
                        posts[index];


                    if(!post){
                        return;
                    }


                    openMutualProfilePostViewer(
                        crush,
                        post,
                        index,
                        posts.length
                    );

                }
            );

        });

}


/* =====================================================
   PROFILE MOMENT VIEWER
   VERTICAL FULL-SCREEN MOMENT FEED
===================================================== */

let SC_ProfileMomentViewerData = {

    crush:
        null,

    posts:
        [],

    index:
        0

};


/* -----------------------------------------------------
   OPEN
----------------------------------------------------- */

function openMutualProfilePostViewer(
    crush,
    post,
    index,
    total
){

    const sourcePosts =
        Array.isArray(
            crush?.posts
        )

            ?

            crush.posts

            :

            [];


    const posts =
        sourcePosts.map(
            (
                item,
                itemIndex
            ) => {

                const stableId =
                    SC_Moment_GetStablePostId(
                        item,
                        crush?.id,
                        itemIndex
                    );


                return SC_Moment_ApplyLikeState(
                    {
                        ...item,

                        id:
                            stableId,

                        ownerId:
                            item.ownerId ||
                            crush?.id ||
                            ""
                    },

                    crush?.id,

                    itemIndex

                );

            }
        );


    /*
     * If the supplied post is not already inside
     * the supplied post list, add it so the viewer
     * always has something to display.
     */

    if(
        post &&
        posts.length === 0
    ){

        const fallbackPost =
            SC_Moment_ApplyLikeState(
                {
                    ...post,

                    id:
                        SC_Moment_GetStablePostId(
                            post,
                            crush?.id,
                            0
                        ),

                    ownerId:
                        post.ownerId ||
                        crush?.id ||
                        ""
                },

                crush?.id,

                0

            );


        posts.push(
            fallbackPost
        );

    }


    /*
     * Locate the actual post by ID.
     * This is safer than relying only on an index.
     */

    let startIndex =
        posts.findIndex(
            item =>
                item.id ===
                post?.id
        );


    /*
     * Fall back to the supplied index.
     */

    if(
        startIndex < 0
    ){

        startIndex =
            Math.max(
                0,
                Math.min(
                    Number(index) || 0,
                    Math.max(
                        0,
                        posts.length - 1
                    )
                )
            );

    }


    SC_ProfileMomentViewerData = {

        crush:
            crush,

        posts:
            posts,

        index:
            startIndex

    };


    let viewer =
        document.getElementById(
            "mutual-profile-post-viewer"
        );


    if(!viewer){

        viewer =
            document.createElement(
                "div"
            );


        viewer.id =
            "mutual-profile-post-viewer";


        viewer.className =
            "mutual-profile-post-viewer";


        document.body.appendChild(
            viewer
        );

    }


    SC_ProfileMoment_Render();


    viewer.classList.add(
        "active"
    );


    viewer.setAttribute(
        "aria-hidden",
        "false"
    );


    /*
     * Lock the page underneath the viewer.
     */

    document.body.classList.add(
        "sc-moment-viewer-open"
    );


    /*
     * Put the requested post at the top of the
     * vertical feed.
     */

    requestAnimationFrame(
        () => {

            SC_ProfileMoment_ScrollToIndex(
                startIndex,
                false
            );

        }
    );

}


/* -----------------------------------------------------
   RENDER
----------------------------------------------------- */

function SC_ProfileMoment_Render(){

    const viewer =
        document.getElementById(
            "mutual-profile-post-viewer"
        );


    if(!viewer){

        return;

    }


    const data =
        SC_ProfileMomentViewerData;


    if(
        !data ||
        !Array.isArray(data.posts) ||
        !data.posts.length
    ){

        return;

    }


    const currentProfile =
        getCurrentProfile();


    viewer.innerHTML = `

        <div
            class="
                sc-profile-moment-backdrop
            "
            data-close-profile-post-viewer
        ></div>


        <section
            class="
                sc-profile-moment-shell
            "
            role="dialog"
            aria-modal="true"
            aria-label="Moments"
        >

            <button
                type="button"
                class="
                    sc-profile-moment-close
                "
                data-close-profile-post-viewer
                aria-label="Close moments"
            >
                ×
            </button>


            <div
                class="
                    sc-profile-moment-counter
                "
                id="sc-profile-moment-counter"
            >
                ${data.index + 1}
                /
                ${data.posts.length}
            </div>


            <div
                class="
                    sc-profile-moment-scroll
                "
                id="sc-profile-moment-scroll"
            >

                ${
                    data.posts
                        .map(
                            (
                                item,
                                itemIndex
                            ) =>
                                SC_ProfileMoment_CreateCard(
                                    item,
                                    itemIndex,
                                    data,
                                    currentProfile
                                )
                        )
                        .join("")
                }

            </div>

        </section>

    `;


    SC_ProfileMoment_AttachEvents();
    
        SC_Moment_HydrateVideoElements(viewer).then(() => {
        const cur = viewer.querySelectorAll(".sc-profile-moment-card")[data.index];
        const v = cur && cur.querySelector("video");
        if (v) SC_VT_Play(v);
    });


    /*
     * Observe which card is currently closest
     * to the centre of the viewer.
     */

    SC_ProfileMoment_SetupObserver();

}


/* -----------------------------------------------------
   CREATE ONE VERTICAL MOMENT CARD
----------------------------------------------------- */

function SC_ProfileMoment_CreateCard(
    post,
    index,
    data,
    currentProfile
){

    const state =
        SC_Moment_GetLikeState(
            post,
            data.crush?.id,
            index
        );


    const liked =
        SC_Moment_IsLikedByCurrentUser(
            post
        );


    const ownerId =
        post.ownerId ||
        data.crush?.id ||
        "";


    const isOwnPost =
        Boolean(
            currentProfile &&
            ownerId &&
            (
                ownerId ===
                currentProfile.userId
            )
        );


    const imageSource =
        post.image ||
        post.media ||
        post.photo ||
        "";


    const username =
        data.crush?.username ||
        post.username ||
        data.crush?.name ||
        post.name ||
        "Secret Crush";


    const caption =
        post.caption ||
        post.text ||
        "";


    return `

        <article
            class="
                sc-profile-moment-card
            "
            data-profile-moment-index="${index}"
            data-profile-moment-id="${escapePostHTML(
                post.id || ""
            )}"
        >

            <div
                class="
                    sc-profile-moment-media
                "
            >

                                ${
                    post.videoMediaId
                    ?
                    `
                    <video
                        class="sc-profile-moment-video"
                        data-moment-video-id="${escapePostHTML(post.videoMediaId)}"
                        playsinline
                        loop
                        preload="metadata"
                    ></video>
                    <button type="button" class="sc-vt-btn" aria-label="Play video">▶</button>
                    `
                    :
                    imageSource
                    ?
                    `
                    <img
                        src="${escapePostHTML(
                            imageSource
                        )}"
                        alt="Moment"
                        draggable="false"
                    >
                    `

                    :

                    `
                    <div
                        class="
                            sc-profile-moment-placeholder
                        "
                    >
                        ${escapePostHTML(
                            post.emoji ||
                            post.text ||
                            "📷"
                        )}
                    </div>
                    `
                }


                <div
                    class="
                        sc-profile-moment-top
                    "
                >

                    <div
                        class="
                            sc-profile-moment-position
                        "
                    >
                        ${index + 1}
                        /
                        ${data.posts.length}
                    </div>

                </div>


                <div
                    class="
                        sc-profile-moment-side-actions
                    "
                >

                    <button
                        type="button"
                        class="
                            sc-profile-moment-like
                            ${
                                liked
                                    ? "liked"
                                    : ""
                            }
                        "
                        data-profile-moment-like
                        data-post-id="${escapePostHTML(
                            post.id || ""
                        )}"
                        aria-label="Like moment"
                    >

                        <span
                            class="
                                sc-profile-moment-like-icon
                            "
                        >
                            ${
                                liked
                                    ? "♥"
                                    : "♡"
                            }
                        </span>

                        <span
                            class="
                                sc-profile-moment-like-count
                            "
                        >
                            ${state.count}
                        </span>

                    </button>

                </div>


                <div
                    class="
                        sc-profile-moment-gradient
                    "
                ></div>


                <div
                    class="
                        sc-profile-moment-info
                    "
                >

                    <div
                        class="
                            sc-profile-moment-user
                        "
                    >

                        <strong>
                            ${escapePostHTML(
                                username
                            )}
                        </strong>

                        <small>
                            ${
                                post.createdAt
                                    ? SC_Moment_FormatDateTime(
                                        post.createdAt
                                    )
                                    : "Date unavailable"
                            }
                        </small>

                    </div>


                    ${
                        caption

                        ?

                        `
                        <p
                            class="
                                sc-profile-moment-caption
                            "
                        >
                            ${escapePostHTML(
                                caption
                            )}
                        </p>
                        `

                        :

                        ""
                    }


                    ${
                        isOwnPost

                        ?

                        `
                        <div
                            class="
                                sc-profile-moment-own-actions
                            "
                        >

                            <button
                                type="button"
                                data-own-edit-caption
                                data-post-id="${escapePostHTML(
                                    post.id || ""
                                )}"
                            >
                                ✎ Edit Caption
                            </button>


                            <button
                                type="button"
                                data-own-view-likes
                                data-post-id="${escapePostHTML(
                                    post.id || ""
                                )}"
                            >
                                ♥ View Likes
                            </button>

                        </div>
                        `

                        :

                        ""
                    }

                </div>

            </div>

        </article>

    `;

}


/* -----------------------------------------------------
   EVENTS
----------------------------------------------------- */

function SC_ProfileMoment_AttachEvents(){

    const viewer =
        document.getElementById(
            "mutual-profile-post-viewer"
        );


    if(!viewer){

        return;

    }


    /*
     * CLOSE
     */

    viewer
        .querySelectorAll(
            "[data-close-profile-post-viewer]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        SC_ProfileMoment_Close();

                    }
                );

            }
        );


    /*
     * LIKE
     */

    viewer
        .querySelectorAll(
            "[data-profile-moment-like]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        const postId =
                            button.dataset.postId;


                        const post =
                            SC_ProfileMoment_FindPost(
                                postId
                            );


                        if(!post){

                            return;

                        }


const state =
    SC_Moment_ToggleLike(
        post
    );


if(!state){

    return;

}


/*
 * Synchronize every visible copy
 * of this moment.
 */

SC_Moment_SyncLikeUI(
    postId,
    state
);

                    }
                );

            }
        );


    /*
     * DOUBLE-TAP TO LIKE
     */

    viewer
        .querySelectorAll(
            ".sc-profile-moment-media"
        )
        .forEach(
            media => {

                let lastTap =
                    0;


                media.addEventListener(
                    "touchend",
                    event => {

                        const now =
                            Date.now();


                        if(
                            now -
                            lastTap <
                            320
                        ){

                            event.preventDefault();


                            const card =
                                media.closest(
                                    ".sc-profile-moment-card"
                                );


                            if(!card){

                                return;

                            }


                            const postId =
                                card.dataset
                                    .profileMomentId;


                            const post =
                                SC_ProfileMoment_FindPost(
                                    postId
                                );


                            if(!post){

                                return;

                            }


                            const alreadyLiked =
                                SC_Moment_IsLikedByCurrentUser(
                                    post
                                );


                            if(!alreadyLiked){

                                const state =
                                    SC_Moment_ToggleLike(
                                        post
                                    );


                                if(state){

                                    SC_ProfileMoment_UpdateLikeUI(
                                        postId,
                                        state
                                    );

                                }

                            }


                            SC_ProfileMoment_ShowHeart(
                                media
                            );

                        }


                        lastTap =
                            now;

                    },
                    {
                        passive:false
                    }
                );

            }
        );


    /*
     * OWN POST — EDIT CAPTION
     */

    viewer
        .querySelectorAll(
            "[data-own-edit-caption]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        const postId =
                            button.dataset.postId;


                        const card =
                            document.querySelector(
                                `.my-post-card[data-post-id="${CSS.escape(postId)}"]`
                            );


                        if(card){

                            openMomentCaptionEditor(
                                card
                            );

                        }

                    }
                );

            }
        );


    /*
     * OWN POST — VIEW LIKES
     */

    viewer
        .querySelectorAll(
            "[data-own-view-likes]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        const postId =
                            button.dataset.postId;


                        const post =
                            SC_ProfileMoment_FindPost(
                                postId
                            );


                        if(post){

                            openMomentLikesViewer(
                                post
                            );

                        }

                    }
                );

            }
        );


    /*
     * ESCAPE TO CLOSE
     */

    if(
        !viewer.dataset
            .escapeBound
    ){

        document.addEventListener(
            "keydown",
            event => {

                if(
                    event.key ===
                    "Escape"
                ){

                    const activeViewer =
                        document.getElementById(
                            "mutual-profile-post-viewer"
                        );


                    if(
                        activeViewer &&
                        activeViewer.classList.contains(
                            "active"
                        )
                    ){

                        SC_ProfileMoment_Close();

                    }

                }

            }
        );


        viewer.dataset.escapeBound =
            "true";

    }

}


/* -----------------------------------------------------
   FIND POST
----------------------------------------------------- */

function SC_ProfileMoment_FindPost(
    postId
){

    const posts =
        SC_ProfileMomentViewerData.posts;


    return posts.find(
        post =>
            String(
                post.id
            ) ===
            String(
                postId
            )
    ) || null;

}


/* -----------------------------------------------------
   UPDATE LIKE UI
----------------------------------------------------- */

function SC_ProfileMoment_UpdateLikeUI(
    postId,
    state
){

    const viewer =
        document.getElementById(
            "mutual-profile-post-viewer"
        );


    if(!viewer){

        return;

    }


    viewer
        .querySelectorAll(
            `[data-profile-moment-like][data-post-id="${CSS.escape(postId)}"]`
        )
        .forEach(
            button => {

                const post =
                    SC_ProfileMoment_FindPost(
                        postId
                    );


                const liked =
                    post
                        ? SC_Moment_IsLikedByCurrentUser(
                            post
                        )
                        : false;


                button.classList.toggle(
                    "liked",
                    liked
                );


                const icon =
                    button.querySelector(
                        ".sc-profile-moment-like-icon"
                    );


                if(icon){

                    icon.textContent =
                        liked
                            ? "♥"
                            : "♡";

                }


                const count =
                    button.querySelector(
                        ".sc-profile-moment-like-count"
                    );


                if(count){

                    count.textContent =
                        state.count;

                }

            }
        );

}


/* -----------------------------------------------------
   HEART ANIMATION
----------------------------------------------------- */

function SC_ProfileMoment_ShowHeart(
    media
){

    if(!media){

        return;

    }


    const heart =
        document.createElement(
            "div"
        );


    heart.className =
        "sc-profile-moment-floating-heart";


    heart.textContent =
        "♥";


    media.appendChild(
        heart
    );


    requestAnimationFrame(
        () => {

            heart.classList.add(
                "show"
            );

        }
    );


    setTimeout(
        () => {

            heart.remove();

        },
        650
    );

}


/* -----------------------------------------------------
   ACTIVE CARD OBSERVER
----------------------------------------------------- */

function SC_ProfileMoment_SetupObserver(){

    const scroll =
        document.getElementById(
            "sc-profile-moment-scroll"
        );


    if(!scroll){

        return;

    }


    const cards =
        scroll.querySelectorAll(
            ".sc-profile-moment-card"
        );


    if(
        !cards.length
    ){

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                let bestEntry =
                    null;


                entries.forEach(
                    entry => {

                        if(
                            !entry.isIntersecting
                        ){

                            return;

                        }


                        if(
                            !bestEntry ||
                            entry.intersectionRatio >
                            bestEntry.intersectionRatio
                        ){

                            bestEntry =
                                entry;

                        }

                    }
                );


                if(!bestEntry){

                    return;

                }


                const index =
                    Number(
                        bestEntry.target.dataset
                            .profileMomentIndex
                    );


                if(
                    Number.isNaN(index)
                ){

                    return;

                }


                SC_ProfileMomentViewerData.index =
                    index;
                    
                                    cards.forEach(card => {
                    const v = card.querySelector("video");
                    if (!v) return;
                    if (card === bestEntry.target) {
                        SC_VT_Play(v);
                    } else {
                        v.pause();
                    }
                });


                const counter =
                    document.getElementById(
                        "sc-profile-moment-counter"
                    );


                if(counter){

                    counter.textContent =
                        `${index + 1} / ${cards.length}`;

                }

            },
            {
                root:
                    scroll,

                threshold:[
                    .55,
                    .7,
                    .85
                ]

            }
        );


    cards.forEach(
        card =>
            observer.observe(
                card
            )
    );

}


/* -----------------------------------------------------
   SCROLL TO CARD
----------------------------------------------------- */

function SC_ProfileMoment_ScrollToIndex(
    index,
    smooth = true
){

    const scroll =
        document.getElementById(
            "sc-profile-moment-scroll"
        );


    if(!scroll){

        return;

    }


    const card =
        scroll.querySelector(
            `.sc-profile-moment-card[data-profile-moment-index="${index}"]`
        );


    if(!card){

        return;

    }


    card.scrollIntoView(
        {
            behavior:
                smooth
                    ? "smooth"
                    : "auto",

            block:
                "start"

        }
    );

}


/* -----------------------------------------------------
   CLOSE
----------------------------------------------------- */

function SC_ProfileMoment_Close(){

    const viewer =
        document.getElementById(
            "mutual-profile-post-viewer"
        );


    if(!viewer){

        return;

    }


    viewer.classList.remove(
        "active"
    );


    viewer.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "sc-moment-viewer-open"
    );

}
/* =====================================================
   MOMENT LIKES VIEWER
===================================================== */

function openMomentLikesViewer(
    post
){

    const state =
        SC_Moment_GetLikeState(
            post
        );


    let viewer =
        document.getElementById(
            "sc-moment-likes-viewer"
        );


    if(!viewer){

        viewer =
            document.createElement(
                "div"
            );


        viewer.id =
            "sc-moment-likes-viewer";


        viewer.className =
            "sc-moment-likes-viewer";


        document.body.appendChild(
            viewer
        );

    }


    const likes =
        state.likedBy
            .slice()
            .sort(
                (
                    a,
                    b
                ) =>
                    new Date(
                        a.likedAt
                    ) -
                    new Date(
                        b.likedAt
                    )
            );


    viewer.innerHTML = `

        <div
            class="
                sc-moment-likes-backdrop
            "
            data-close-moment-likes
        ></div>


        <section
            class="
                sc-moment-likes-panel
            "
        >

            <header
                class="
                    sc-moment-likes-header
                "
            >

                <div>

                    <strong>
                        Likes
                    </strong>

                    <small>
                        ${state.count}
                        ${
                            state.count === 1
                                ? "like"
                                : "likes"
                        }
                    </small>

                </div>


                <button
                    type="button"
                    data-close-moment-likes
                    aria-label="Close likes"
                >
                    ×
                </button>

            </header>


            <div
                class="
                    sc-moment-likes-list
                "
            >

                ${
                    likes.length

                    ?

                    likes
                        .map(
                            person => `

                                <article
                                    class="
                                        sc-moment-like-card
                                    "
                                >

                                    ${
                                        person.photo

                                        ?

                                        `
                                        <img
                                            src="${escapePostHTML(
                                                person.photo
                                            )}"
                                            alt=""
                                        >
                                        `

                                        :

                                        `
                                        <div
                                            class="
                                                sc-moment-like-avatar
                                            "
                                        >
                                            ?
                                        </div>
                                        `
                                    }


                                    <div
                                        class="
                                            sc-moment-like-person
                                        "
                                    >

                                        <strong>
                                            ${escapePostHTML(
                                                person.name ||
                                                person.username ||
                                                "Secret Crush"
                                            )}
                                        </strong>


                                        ${
                                            person.username
                                                ? `
                                                    <span>
                                                        ${escapePostHTML(
                                                            person.username
                                                        )}
                                                    </span>
                                                `
                                                : ""
                                        }


                                        <small>
                                            ${SC_Moment_FormatDateTime(
                                                person.likedAt
                                            )}
                                        </small>

                                    </div>

                                </article>

                            `
                        )
                        .join("")

                    :

                    `
                    <div
                        class="
                            sc-moment-no-likes
                        "
                    >

                        ${
                            state.count > 0

                            ?

                            `
                            <strong>
                                ${state.count}
                                ${
                                    state.count === 1
                                        ? "like"
                                        : "likes"
                                }
                            </strong>

                            <p>
                                Some of these likes were
                                recorded before the detailed
                                like registry was introduced.
                            </p>
                            `

                            :

                            `
                            <p>
                                Nobody has liked this moment yet.
                            </p>
                            `
                        }

                    </div>
                    `

                }

            </div>

        </section>

    `;


    viewer.classList.add(
        "active"
    );


    viewer
        .querySelectorAll(
            "[data-close-moment-likes]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        viewer.classList.remove(
                            "active"
                        );

                    }
                );

            }
        );

}






/* =====================================================
INSUFFICIENT COINS MODAL — REFERENCES
===================================================== */

const insufficientCoinsModal =
    document.getElementById("insufficient-coins-modal");

const insufficientCoinsBackdrop =
    document.getElementById("insufficient-coins-backdrop");

const insufficientCoinsClose =
    document.getElementById("insufficient-coins-close");

const insufficientCoinsNeeded =
    document.getElementById("insufficient-coins-needed");

let pendingCoinAction = null;


/* =====================================================
INSUFFICIENT COINS MODAL — OPEN / CLOSE
===================================================== */

function openInsufficientCoinsModal(amountNeeded, retryAction){

    if(!insufficientCoinsModal) return;

    pendingCoinAction = retryAction || null;

    if(insufficientCoinsNeeded){

        const shortBy =
            amountNeeded - getBankCoinBalance();

        insufficientCoinsNeeded.textContent =
            shortBy > 0
                ? `You need ${shortBy} more coins to continue.`
                : "You need more coins to continue.";

    }

    insufficientCoinsModal.classList.add("active");

    insufficientCoinsModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeInsufficientCoinsModal(){

    if(!insufficientCoinsModal) return;

    insufficientCoinsModal.classList.remove("active");

    insufficientCoinsModal.setAttribute(
        "aria-hidden",
        "true"
    );

    pendingCoinAction = null;

}


/* =====================================================
INSUFFICIENT COINS MODAL — GRANT COINS

LATER: purchaseCoinPack() should call a real payment
provider before crediting coins. watchAdForCoins()
should call Google AdSense's rewarded ad SDK (or
another ad network) and only credit coins once the
SDK confirms the ad was watched to completion.

Both currently credit coins immediately as placeholders,
consistent with the rest of the app's demo data mode.
===================================================== */

function purchaseCoinPack(amount){

    const balance =
        getBankCoinBalance();

    localStorage.setItem(
        SC_COINS_KEY,
        String(balance + amount)
    );

    updateAppTransactionsBalance();
    updateBankBalance();

    closeInsufficientCoinsModal();

    if(typeof pendingCoinAction === "function"){

        pendingCoinAction();

    }

}


function watchAdForCoins(){

    /*
     * LATER: replace this immediate credit with the
     * ad SDK's "reward earned" callback.
     */

    purchaseCoinPack(10);

}


if(insufficientCoinsBackdrop){

    insufficientCoinsBackdrop.addEventListener(
        "click",
        closeInsufficientCoinsModal
    );

}

if(insufficientCoinsClose){

    insufficientCoinsClose.addEventListener(
        "click",
        closeInsufficientCoinsModal
    );

}


/* =====================================================
DETAIL ROW HELPER
===================================================== */


function createCrushDetailRow(label,value){

    const hidden =
        value === "Hidden";

    return `

        <div class="incoming-crush-detail-row">

            <span>${label}:</span>

            <strong
                class="${hidden ? "hidden-value" : ""}"
            >
                ${value}
            </strong>

        </div>

    `;
}


/* =====================================================
ATTACH CARD BUTTONS
===================================================== */

function attachIncomingCrushButtons(){

    document
        .querySelectorAll("[data-reveal-crush]")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    const id =
                        button.dataset.revealCrush;

                    openRevealModal(id);

                }
            );

        });


    document
        .querySelectorAll("[data-game-crush]")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    const id =
                        button.dataset.gameCrush;

                    openCrushGame(id);

                }
            );

        });

}


/* =====================================================
OPEN REVEAL MODAL
===================================================== */

function openRevealModal(crushId){

    const crush =
        SC_DEMO_CRUSHES.find(
            item => item.id === crushId
        );

    if(!crush) return;

    activeIncomingCrush = crush;

    if(crushRevealTitle){

        crushRevealTitle.textContent =
            `Reveal ${crush.name}'s information`;

    }

    renderRevealFields(crush);

    crushRevealModal.classList.add("active");

    crushRevealModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* =====================================================
RENDER REVEAL FIELDS
===================================================== */

function renderRevealFields(crush){

    if(!crushRevealFields) return;

    const fields = [

        {
            key:"name",
            label:"Name",
            value:crush.name
        },

        {
            key:"year",
            label:"Year",
            value:crush.year
        },

        {
            key:"school",
            label:"School",
            value:crush.school
        },

        {
            key:"faculty",
            label:"Faculty",
            value:crush.faculty
        }

    ];


    crushRevealFields.innerHTML = fields.map(
        field => {

            const revealed =
                crush.revealed[field.key];

            return `

                <div class="crush-reveal-field">

                    <div class="crush-reveal-field-info">

                        <span class="crush-reveal-field-label">
                            ${field.label}
                        </span>

                        <span
                            class="
                                crush-reveal-field-value
                                ${revealed ? "" : "hidden"}
                            "
                        >
                            ${
                                revealed
                                    ? field.value
                                    : "Hidden by sender"
                            }
                        </span>

                    </div>


                    ${
                        revealed

                        ? `
                            <button
                                type="button"
                                class="crush-request-button requested"
                                disabled
                            >
                                REVEALED
                            </button>
                        `

                        : `
                            <button
                                type="button"
                                class="crush-request-button"
                                data-request-field="${field.key}"
                            >
                                REQUEST
                            </button>
                        `
                    }

                </div>

            `;

        }
    ).join("");


    document
        .querySelectorAll("[data-request-field]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    sendRevealRequest(
                        crush.id,
                        button.dataset.requestField,
                        button
                    );

                }
            );

        });

}


/* =====================================================
SEND REVEAL REQUEST
===================================================== */

function sendRevealRequest(
    crushId,
    field,
    button
){

    /*
    IMPORTANT:

    NO COINS ARE REMOVED HERE.

    The request is simply sent to the sender.

    Later this function will call the backend.
    */

    button.textContent =
        "REQUEST SENT";

    button.classList.add(
        "requested"
    );

    button.disabled = true;


    /*
    DEMO ONLY

    We intentionally DO NOT reveal the
    information automatically.

    In the real application:

    sender accepts
          ↓
    backend charges coins
          ↓
    backend reveals field
          ↓
    UI refreshes

    */

    console.log(
        "Reveal request sent:",
        {
            crushId,
            field,
            charged:false
        }
    );

}


/* =====================================================
CLOSE REVEAL MODAL
===================================================== */

function closeRevealModal(){

    if(!crushRevealModal) return;

    crushRevealModal.classList.remove(
        "active"
    );

    crushRevealModal.setAttribute(
        "aria-hidden",
        "true"
    );

}
/* =====================================================
GUESS MY CRUSH — ACTIVE GAME STORAGE
===================================================== */

const CRUSH_GAMES_STORAGE_KEY =
    "secretCrushActiveGames";
/* =====================================================
   GUESS MY CRUSH — ACTIVE GAMES ONLY
   ===================================================== */

function getActiveCrushGames(){

    return getCrushGames().filter(
        game =>
            game &&
            game.status === "in-progress"
    );

}

function getCrushGames(){

    try{

        const saved =
            JSON.parse(
                localStorage.getItem(
                    CRUSH_GAMES_STORAGE_KEY
                ) || "[]"
            );


        return Array.isArray(saved)
            ? saved
            : [];

    }catch(error){

        console.error(
            "Unable to load crush games:",
            error
        );

        return [];

    }

}


/* =====================================================
   GUESS MY CRUSH — ACTIVE GAMES ONLY
   Single source of truth for active game counts.
===================================================== */

function getActiveCrushGames(){

    return getCrushGames().filter(
        game =>
            game &&
            game.status === "in-progress"
    );

}

/* =====================================================
   GUESS MY CRUSH — ACTIVITY HUB COUNT
===================================================== */

function updateGuessMyCrushCounts(){

    const activeGames =
        getActiveCrushGames();


    const count =
        activeGames.length;


    /* ---------------------------------------------
       ACTIVITY HUB BADGE
    --------------------------------------------- */

    document.querySelectorAll(
        ".game-badge"
    ).forEach(
        badge => {

            badge.textContent =
                count;

        }
    );


    /* ---------------------------------------------
       ACTIVITY HUB PREVIEW
       Show up to two real active games.
    --------------------------------------------- */

    const preview =
        document.querySelector(
            ".activity-game-preview"
        );


    if(!preview){

        return;

    }


    preview.innerHTML = "";


    const previewGames =
        activeGames.slice(
            0,
            2
        );


    previewGames.forEach(
        game => {

            const crush =
                getCrushGamePerson(
                    game
                );


            if(!crush){

                return;

            }


            const customName =
                getCrushNames()[crush.id] ||
                game.customName ||
                "My Secret Crush";


            const answered =
                Array.isArray(
                    game.answers
                )
                    ? game.answers.length
                    : 0;


            const row =
                document.createElement(
                    "span"
                );


            row.className =
                "activity-game-row";


            row.innerHTML = `

                <span class="game-avatar">

                    ${
                        crush.photo

                            ? `
                                <img
                                    src="${crush.photo}"
                                    alt=""
                                >
                            `

                            : `
                                ?
                            `
                    }

                </span>


                <span class="game-info">

                    <strong>
                        ${customName}
                    </strong>

                    <small>
                        Round ${game.currentRound || 1}
                        •
                        ${answered}/3 questions
                    </small>

                </span>


                <span class="game-continue">
                    Continue →
                </span>

            `;


            preview.appendChild(
                row
            );

        }
    );


    /* ---------------------------------------------
       EMPTY PREVIEW
    --------------------------------------------- */

    if(!previewGames.length){

        preview.innerHTML = `

            <span class="activity-game-row">

                <span class="game-avatar">
                    🎮
                </span>

                <span class="game-info">

                    <strong>
                        No active games
                    </strong>

                    <small>
                        Start a crush game to see it here.
                    </small>

                </span>

            </span>

        `;

    }

}



function saveCrushGames(games){

    localStorage.setItem(
        CRUSH_GAMES_STORAGE_KEY,
        JSON.stringify(games)
    );

}




function getCrushGameForPerson(crushId){

    return getCrushGames().find(
        game =>
            game.crushId === crushId &&
            game.status === "in-progress"
    ) || null;

}


function createCrushGame(crush){

    const existing =
        getCrushGameForPerson(
            crush.id
        );


    if(existing){

        return existing;

    }


    const savedNames =
        getCrushNames();


    const game = {

        id:
            "crush-game-" +
            crush.id,

        crushId:
            crush.id,

        customName:
            savedNames[crush.id] ||
            "My Secret Crush",

        status:
            "in-progress",

        currentRound:
            1,

        currentQuestion:
            0,

        roundScores:{
            1:null,
            2:null,
            3:null
        },

        answers:[],

        createdAt:
            Date.now()

    };


        /*
     * A new Guess My Crush game costs
     * exactly ONE Game Bank game.
     */

    const spent =
        spendSecretCrushGame(
            "Guess My Crush — New Game"
        );


    if(!spent){

        return null;

    }


    const games =
        getCrushGames();


    games.unshift(game);


    saveCrushGames(games);


    /*
     * Refresh Activity Hub counts because
     * a new active game now exists.
     */

    if(
        typeof SC_ActivityHub_RefreshCounts ===
        "function"
    ){

        SC_ActivityHub_RefreshCounts();

    }


    return game;


if(
    typeof updateGuessMyCrushCounts ===
    "function"
){

    updateGuessMyCrushCounts();

}


return game;

}


function updateCrushGame(
    gameId,
    updater
){

    const games =
        getCrushGames();


    const index =
        games.findIndex(
            game =>
                game.id === gameId
        );


    if(index === -1){

        return null;

    }


    const updated =
        updater(
            games[index]
        ) || games[index];


    games[index] =
        updated;


    saveCrushGames(
        games
    );


    return updated;

}


/* =====================================================
   GUESS MY CRUSH — EXISTING GAME BANK MIGRATION
   ===================================================== */

const CRUSH_GAME_SPEND_MIGRATION_KEY =
    "secretCrushGameSpendMigrationV1";


function migrateExistingCrushGamesToGameBank(){

    if(
        localStorage.getItem(
            CRUSH_GAME_SPEND_MIGRATION_KEY
        )
    ){

        return;

    }


    const games =
        getActiveCrushGames();


    /*
     * These games were created before Game Bank
     * spending was connected.
     *
     * We record their historical expenditure once.
     */

    games.forEach(
        game => {

            recordAppSpend({

                title:
                    "Guess My Crush — Existing Game",

                amount:
                    1

            });

        }
    );


    localStorage.setItem(
        CRUSH_GAME_SPEND_MIGRATION_KEY,
        "true"
    );

}


function getCrushGamePerson(game){

    return SC_DEMO_CRUSHES.find(
        crush =>
            crush.id === game.crushId
    ) || null;

}

/* =====================================================
GUESS MY CRUSH — MAIN + INDIVIDUAL GAME
===================================================== */

const guessMyCrushPage =
    document.getElementById(
        "guess-my-crush-page"
    );


const guessMyCrushBack =
    document.getElementById(
        "guess-my-crush-back"
    );


let activeCrushGame =
    null;


/* =====================================================
OPEN MAIN GUESS MY CRUSH PAGE
===================================================== */

function openGuessMyCrushPage(){

    if(!guessMyCrushPage){

        return;

    }


    closeActivityHub();


    guessMyCrushPage.classList.add(
        "active"
    );


    guessMyCrushPage.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "guess-my-crush-open"
    );


    updateGuessMyCrushCounts();

renderActiveGames();


    updateAllGameBalanceDisplays();
}


/* =====================================================
CLOSE MAIN GUESS MY CRUSH PAGE
===================================================== */

function closeGuessMyCrushPage(){

    if(!guessMyCrushPage){

        return;

    }


    guessMyCrushPage.classList.remove(
        "active"
    );


    guessMyCrushPage.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "guess-my-crush-open"
    );


    openActivityHub();

}


/* =====================================================
RENDER ACTIVE GAME CARDS
===================================================== */

function renderActiveGames(){

    const list =
        document.getElementById(
            "active-games-list"
        );


    const empty =
        document.getElementById(
            "active-games-empty"
        );


    if(!list){

        return;

    }


    const games =
    getActiveCrushGames();


    list.innerHTML = "";


    if(!games.length){

        if(empty){

            empty.hidden = false;

        }

        return;

    }


    if(empty){

        empty.hidden = true;

    }


    const savedNames =
        getCrushNames();


    games.forEach(
        game => {

            const crush =
                getCrushGamePerson(
                    game
                );


            if(!crush){

                return;

            }


            const customName =
                savedNames[crush.id] ||
                game.customName ||
                "My Secret Crush";


            const totalAnswered =
                game.answers.length;


            const card =
                document.createElement(
                    "button"
                );


            card.type =
                "button";


            card.className =
                "active-game-card";


            card.dataset.gameId =
                game.id;


            card.innerHTML = `

                <div class="active-game-avatar">

                    ${
                        crush.photo

                            ? `
                                <img
                                    src="${crush.photo}"
                                    alt="Profile"
                                >
                            `

                            : `
                                ?
                            `
                    }

                </div>


                <div class="active-game-card-content">

                    <span class="active-game-eyebrow">
                        GUESS MY CRUSH
                    </span>


                    <strong class="active-game-name">
                        ${customName}
                    </strong>


                    <small>
                        ${
                            crush.revealed.name
                                ? crush.name
                                : "Mystery Crush"
                        }
                        ·
                        Round ${game.currentRound}
                        ·
                        ${totalAnswered}/3 answered
                    </small>


                    <div class="active-game-progress">

                        <span
                            style="width:${Math.min(
                                100,
                                totalAnswered / 9 * 100
                            )}%"
                        ></span>

                    </div>

                </div>


                <span class="active-game-arrow">
                    →
                </span>

            `;


            list.appendChild(
                card
            );

        }
    );


    list
        .querySelectorAll(
            "[data-game-id]"
        )
        .forEach(
            card => {

                card.addEventListener(
    "click",
    event => {

        event.preventDefault();


        const gameId =
            card.dataset.gameId;


        if(!gameId){

            return;

        }


        openCrushGameDetail(
            gameId
        );

    }
);

            }
        );

}

/* =====================================================
PLAY GAME FROM INCOMING CRUSHES
===================================================== */

function openCrushGame(crushId){

    const crush =
        SC_DEMO_CRUSHES.find(
            item =>
                item.id === crushId
        );


    if(!crush){

        return;

    }


    /*
     * Check whether this crush already has
     * an active game.
     */

    let game =
        getCrushGameForPerson(
            crushId
        );


    /*
     * If this is the first time PLAY GAME
     * has been pressed, create the game.
     */

    if(!game){

        game =
            createCrushGame(
                crush
            );

    }


    if(!game){

        return;

    }


    activeCrushGame =
        game;


    /*
     * FIRST:
     * close the Incoming Crushes interface.
     *
     * We intentionally do NOT call
     * closeIncomingCrushes(), because that function
     * opens the Activity Hub again.
     */

    if(incomingCrushView){

        incomingCrushView.classList.remove(
            "active"
        );


        incomingCrushView.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /*
     * SECOND:
     * make sure the Activity Hub itself is closed.
     */

    closeActivityHub();


    /*
     * THIRD:
     * refresh Incoming Crushes in the background.
     *
     * This immediately changes the card to:
     * "Game in progress"
     */

    renderIncomingCrushes();


    /*
     * FOURTH:
     * open the main Guess My Crush interface.
     */

    openGuessMyCrushPage();


    /*
     * FIFTH:
     * automatically open the exact game that
     * the user just selected.
     */

    setTimeout(
        () => {

            openCrushGameDetail(
                game.id
            );

        },
        250
    );

}


/* =====================================================
OPEN INDIVIDUAL GAME
===================================================== */

function openCrushGameDetail(gameId){

    const games =
        getCrushGames();


    const game =
        games.find(
            item =>
                item.id === gameId
        );


    if(!game){

        return;

    }


    const crush =
        getCrushGamePerson(
            game
        );


    if(!crush){

        return;

    }


    activeCrushGame =
        game;


    renderCrushGame(
        crush,
        game
    );


    if(crushGameModal){

        crushGameModal.classList.add(
            "active"
        );


        crushGameModal.setAttribute(
            "aria-hidden",
            "false"
        );

    }

}


/* =====================================================
RENDER INDIVIDUAL GAME
===================================================== */

/* =====================================================
RENDER INDIVIDUAL GAME
===================================================== */

function renderCrushGame(
    crush,
    game
){

    const savedNames =
        getCrushNames();


    const gameName =
        savedNames[crush.id] ||
        game.customName ||
        "My Secret Crush";


    if(crushGameTitle){

        crushGameTitle.textContent =
            gameName;

    }


    if(crushGameProfile){

        crushGameProfile.classList.remove(
            "is-minimized"
        );


        crushGameProfile.innerHTML = `

            <button
                type="button"
                class="crush-profile-collapse"
                aria-label="Minimize crush profile"
                title="Minimize"
            >
                ×
            </button>


            <div
                class="crush-game-profile-card-inner"
                data-crush-id="${crush.id}"
            >

                <div class="crush-game-profile-avatar">

                    ${
                        crush.photo

                            ? `
                                <img
                                    src="${crush.photo}"
                                    alt="Profile"
                                >
                            `

                            : `
                                ?
                            `
                    }

                </div>


                <div class="crush-game-profile-main">

                    <span class="crush-game-profile-eyebrow">
                        YOUR CRUSH
                    </span>


                    <h3 class="crush-display-name">
                        ${
                            crush.revealed.name
                                ? crush.name
                                : "Mystery"
                        }
                    </h3>


                    <button
                        type="button"
                        class="crush-name-trigger"
                    >
                        ✎ Edit Name
                    </button>


                    <div class="crush-game-custom-name">

                        <small>
                            GAME NAME
                        </small>

                        <strong>
                            ${gameName}
                        </strong>

                    </div>


                    <div class="crush-game-revealed-mini">

                        <div>
                            <small>Institution</small>

                            <strong>
                                ${
                                    crush.revealed.school
                                        ? crush.school
                                        : "Hidden"
                                }
                            </strong>
                        </div>


                        <div>
                            <small>Faculty</small>

                            <strong>
                                ${
                                    crush.revealed.faculty
                                        ? crush.faculty
                                        : "Hidden"
                                }
                            </strong>
                        </div>


                        <div>
                            <small>Year</small>

                            <strong>
                                ${
                                    crush.revealed.year
                                        ? crush.year
                                        : "Hidden"
                                }
                            </strong>
                        </div>

                    </div>

                </div>

            </div>


            <button
                type="button"
                class="crush-profile-expand"
                aria-label="Restore crush profile"
                title="Restore"
            >
                ⌄
            </button>

        `;


        /* ---------------------------------------------
           EDIT GAME NAME
        --------------------------------------------- */

        const editNameButton =
            crushGameProfile.querySelector(
                ".crush-name-trigger"
            );


        if(editNameButton){

            editNameButton.addEventListener(
                "click",
                () => {

                    currentNamingCrushId =
                        crush.id;

                    openCrushNameModal();

                }
            );

        }


        /* ---------------------------------------------
           MINIMIZE PROFILE
        --------------------------------------------- */

        const collapseButton =
            crushGameProfile.querySelector(
                ".crush-profile-collapse"
            );


        if(collapseButton){

            collapseButton.addEventListener(
                "click",
                () => {

                    crushGameProfile.classList.add(
                        "is-minimized"
                    );

                }
            );

        }


        /* ---------------------------------------------
           RESTORE PROFILE
        --------------------------------------------- */

        const expandButton =
            crushGameProfile.querySelector(
                ".crush-profile-expand"
            );


        if(expandButton){

            expandButton.addEventListener(
                "click",
                () => {

                    crushGameProfile.classList.remove(
                        "is-minimized"
                    );

                }
            );

        }

    }


    renderGameProgress(
        game
    );


    renderGameClues(
        crush
    );


    renderCurrentCrushQuestion(
        crush,
        game
    );


    renderRevealedInformation(
        crush
    );


    renderCrushMessages(
        crush,
        game
    );


    setupCrushGameTabs();

}


/* =====================================================
HORIZONTAL GAME TABS
===================================================== */
/* =====================================================
HORIZONTAL GAME TABS
===================================================== */

function setupCrushGameTabs(){

    const tabs =
        document.querySelectorAll(
            "#crush-game-tabs [data-game-slide]"
        );


    const track =
        document.getElementById(
            "crush-game-track"
        );


    if(!track || !tabs.length){

        return;

    }


    /* ---------------------------------------------
       BUTTON → SLIDE
    --------------------------------------------- */

    tabs.forEach(
        tab => {

            tab.onclick =
                () => {

                    const index =
                        Number(
                            tab.dataset.gameSlide
                        );


                    track.scrollTo({

                        left:
                            track.clientWidth *
                            index,

                        behavior:
                            "smooth"

                    });

                };

        }
    );


    /* ---------------------------------------------
       SLIDE → BUTTON
       Keeps the highlighted tab synchronized
       with horizontal swiping.
    --------------------------------------------- */

    if(
        track.dataset.tabsSyncAttached !==
        "true"
    ){

        track.addEventListener(
            "scroll",
            () => {

                const width =
                    track.clientWidth;


                if(!width){

                    return;

                }


                const index =
                    Math.round(
                        track.scrollLeft /
                        width
                    );


                tabs.forEach(
                    tab => {

                        const tabIndex =
                            Number(
                                tab.dataset.gameSlide
                            );


                        tab.classList.toggle(
                            "active",
                            tabIndex === index
                        );

                    }
                );

            },
            {
                passive:true
            }
        );


        track.dataset.tabsSyncAttached =
            "true";

    }


    /* ---------------------------------------------
       INITIAL ACTIVE TAB
    --------------------------------------------- */

    const initialIndex =
        Math.round(
            track.scrollLeft /
            Math.max(
                track.clientWidth,
                1
            )
        );


    tabs.forEach(
        tab => {

            tab.classList.toggle(
                "active",

                Number(
                    tab.dataset.gameSlide
                ) === initialIndex

            );

        }
    );

}


/* =====================================================
GAME PROGRESS
===================================================== */

function renderGameProgress(game){

    const container =
        document.getElementById(
            "crush-round-progress"
        );


    if(!container){

        return;

    }


    const rounds = [1,2,3];


    container.innerHTML = `

        <div class="crush-progress-line">

            ${rounds.map(
                round => {

                    const score =
                        game.roundScores[
                            round
                        ];


                    const current =
                        game.currentRound ===
                        round;


                    const completed =
                        score !== null &&
                        score !== undefined;


                    return `

                        <div
                            class="
                                crush-progress-round
                                ${current ? "current" : ""}
                                ${completed ? "completed" : ""}
                            "
                        >

                            <span
                                class="crush-progress-number"
                            >
                                ${round}
                            </span>


                            <div>

                                <strong>
                                    Round ${round}
                                </strong>

                                <small>
                                    ${
                                        completed
                                            ? `${score}/3`
                                            : "0/3"
                                    }
                                </small>

                            </div>

                        </div>

                    `;

                }
            ).join("")}

        </div>

        <div class="crush-progress-track">

            <span
                style="width:${Math.max(
                    0,
                    Math.min(
                        100,
                        ((game.currentRound - 1) / 2) * 100
                    )
                )}%"
            ></span>

        </div>

    `;

}


/* =====================================================
GAME CLUES
===================================================== */

function renderGameClues(crush){

    const revealedContainer =
    document.getElementById(
        "crush-revealed-clues"
    );


const hiddenContainer =
    document.getElementById(
        "crush-hidden-clues"
    );


const goldenContainer =
    document.getElementById(
        "crush-golden-clue"
    );

    /*
     * REVEALED CLUES
     */

    if(revealedContainer){

        const clues =
            crush.revealedClues ||
            [];


        revealedContainer.innerHTML =
            clues.length

                ? clues.map(
                    clue => `
                        <div class="game-clue revealed-clue">
                            <span>✦</span>
                            <p>${clue}</p>
                        </div>
                    `
                ).join("")

                : `
                    <div class="game-clue-empty">
                        No revealed clues yet.
                    </div>
                `;

    }


    /*
     * HIDDEN CLUES
     */

    if(hiddenContainer){

        const clues =
            crush.hiddenClues ||
            [];


        hiddenContainer.innerHTML =
            clues.length

                ? clues.map(
                    clue => `

                        <button
                            type="button"
                            class="game-clue locked-clue"
                            data-hidden-clue="${clue.id}"
                        >

                            <span class="locked-clue-icon">
                                🔒
                            </span>

                            <span class="locked-clue-content">

                                <strong>
                                    ${clue.text}
                                </strong>

                                <small>
                                    Reveal for ${clue.cost} coins
                                </small>

                            </span>

                            <span class="locked-clue-arrow">
                                →
                            </span>

                        </button>

                    `
                ).join("")

                : "";

    }


    /*
     * GOLDEN CLUE
     */

    if(goldenContainer){

        const golden =
            crush.goldenClue;


        if(!golden){

            goldenContainer.innerHTML = "";

            return;

        }


        goldenContainer.innerHTML = `

            <button
                type="button"
                class="game-golden-clue"
                data-golden-clue="${crush.id}"
            >

                <span class="golden-clue-star">
                    ★
                </span>


                <span class="golden-clue-content">

                    <strong>
                        Golden Clue
                    </strong>


                    <small>
                        ${
                            golden.revealed
                                ? golden.text
                                : `Unlock for ${golden.cost} coins`
                        }
                    </small>

                </span>


                ${
                    golden.revealed

                        ? `
                            <span>
                                ✓
                            </span>
                        `

                        : `
                            <span class="golden-clue-lock">
                                🔒
                            </span>
                        `
                }

            </button>

        `;

    }

}

/* =====================================================
DEMO ROUND 1 QUESTIONS
===================================================== */

function getRoundOneQuestions(
    crush
){

    return [

        {
            question:
                "Which institution does this crush attend?",

            options:[
                crush.school,
                "Strathmore University",
                "United States International University",
                "Mount Kenya University"
            ],

            answer:
                crush.school

        },


        {
            question:
                "Which faculty is this crush in?",

            options:[
                crush.faculty,
                "Medicine",
                "Law",
                "Engineering"
            ],

            answer:
                crush.faculty

        },


        {
            question:
                "What year of study are they in?",

            options:[
                crush.year,
                "1st Year",
                "3rd Year",
                "4th Year"
            ],

            answer:
                crush.year

        }

    ];

}


/* =====================================================
RENDER CURRENT QUESTION
===================================================== */

function renderCurrentCrushQuestion(
    crush,
    game
){

    const container =
        document.getElementById(
            "crush-current-question"
        );


    if(!container){

        return;

    }


    /*
     * For now Round 1 is active.
     * Rounds 2 and 3 will use their own question
     * sets when we build the next milestone.
     */

    const questions =
        getRoundOneQuestions(
            crush
        );


    const question =
        questions[
            game.currentQuestion
        ];


    if(!question){

        renderRoundFinished(
            crush,
            game
        );

        return;

    }


    container.innerHTML = `

        <div class="crush-question-card">

            <div class="crush-question-top">

                <span>
                    ROUND ${game.currentRound}
                </span>

                <small>
                    Question ${game.currentQuestion + 1} of 3
                </small>

            </div>


            <h3>
                ${question.question}
            </h3>


            <div class="crush-question-options">

                ${question.options.map(
                    option => `

                        <button
                            type="button"
                            class="crush-question-option"
                            data-answer="${option}"
                        >
                            <span></span>
                            ${option}
                        </button>

                    `
                ).join("")}

            </div>


            <button
                type="button"
                class="crush-submit-answer"
                id="crush-submit-answer"
                disabled
            >
                SUBMIT ANSWER
            </button>

        </div>

    `;


    let selectedAnswer =
        null;


    const optionButtons =
        container.querySelectorAll(
            ".crush-question-option"
        );


    optionButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    optionButtons.forEach(
                        item =>
                            item.classList.remove(
                                "selected"
                            )
                    );


                    button.classList.add(
                        "selected"
                    );


                    selectedAnswer =
                        button.dataset.answer;


                    const submit =
                        document.getElementById(
                            "crush-submit-answer"
                        );


                    if(submit){

                        submit.disabled =
                            false;

                    }

                }
            );

        }
    );


    const submit =
        document.getElementById(
            "crush-submit-answer"
        );


    if(submit){

        submit.addEventListener(
            "click",
            () => {

                submitCrushAnswer(
                    crush,
                    game,
                    selectedAnswer,
                    question
                );

            }
        );

    }

}


/* =====================================================
SUBMIT ANSWER
===================================================== */

function submitCrushAnswer(
    crush,
    game,
    selectedAnswer,
    question
){

    if(selectedAnswer === null){

        return;

    }


    const correct =
        selectedAnswer ===
        question.answer;


    updateCrushGame(
        game.id,
        current => {

            current.answers =
                current.answers || [];


            current.answers.push({

                round:
                    game.currentRound,

                question:
                    game.currentQuestion,

                selected:
                    selectedAnswer,

                correct

            });


            current.currentQuestion += 1;


            return current;

        }
    );


    activeCrushGame =
        getCrushGameForPerson(
            crush.id
        );


    renderCrushGame(
        crush,
        activeCrushGame
    );

}


/* =====================================================
ROUND FINISHED
===================================================== */

function renderRoundFinished(
    crush,
    game
){

    const container =
        document.getElementById(
            "crush-current-question"
        );


    if(!container){

        return;

    }


    const roundAnswers =
        (game.answers || [])
            .filter(
                answer =>
                    answer.round ===
                    game.currentRound
            );


    const score =
        roundAnswers.filter(
            answer =>
                answer.correct
        ).length;


    updateCrushGame(
        game.id,
        current => {

            current.roundScores[
                current.currentRound
            ] = score;


            return current;

        }
    );


    container.innerHTML = `

        <div class="crush-round-result-card">

            <span>
                ROUND ${game.currentRound}
            </span>

            <h3>
                Round complete
            </h3>

            <strong>
                ${score}/3
            </strong>

            <p>
                Your answers have been recorded.
            </p>

        </div>

    `;

}


/* =====================================================
REVEALED INFORMATION
===================================================== */

function renderRevealedInformation(
    crush
){

    if(!crushGameInfoGrid){

        return;

    }


    const fields = [

        [
            "Name",
            crush.name,
            "name"
        ],

        [
            "Institution",
            crush.school,
            "school"
        ],

        [
            "Faculty",
            crush.faculty,
            "faculty"
        ],

        [
            "Year",
            crush.year,
            "year"
        ]

    ];


    crushGameInfoGrid.innerHTML =
        fields.map(
            ([label,value,key]) => `

                <div class="crush-game-info-item">

                    <small>
                        ${label}
                    </small>

                    <strong
                        class="${
                            crush.revealed[key]
                                ? ""
                                : "hidden"
                        }"
                    >
                        ${
                            crush.revealed[key]
                                ? value
                                : "Hidden"
                        }
                    </strong>

                    ${
                        crush.revealed[key]
                            ? ""
                            : `
                                <button
                                    type="button"
                                    class="crush-inline-request"
                                    data-request-field="${key}"
                                >
                                    REQUEST REVEAL
                                </button>
                            `
                    }

                </div>

            `
        ).join("");


    document
        .querySelectorAll(
            "[data-request-field]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        sendRevealRequest(
                            crush.id,
                            button.dataset.requestField,
                            button
                        );

                    }
                );

            }
        );

}


/* =====================================================
MESSAGES / EVERYTHING FROM THIS CRUSH
===================================================== */

function renderCrushMessages(
    crush,
    game
){

    const container =
        document.getElementById(
            "crush-game-messages"
        );


    if(!container){

        return;

    }


    container.innerHTML = `

        <div class="crush-everything-card">

            <div>
                💌
            </div>

            <strong>
                Everything From This Crush
            </strong>

            <p>
                Secret notes, new clues, reveal activity
                and other notifications from this crush
                will appear here.
            </p>

        </div>

    `;

}


/* =====================================================
CLOSE INDIVIDUAL GAME
===================================================== */

function closeCrushGame(){

    if(!crushGameModal){

        return;

    }


    crushGameModal.classList.remove(
        "active"
    );


    crushGameModal.setAttribute(
        "aria-hidden",
        "true"
    );


    activeCrushGame =
        null;

}


/* =====================================================
ACTIVITY HUB → GUESS MY CRUSH
===================================================== */

activityCards.forEach(
    card => {

        if(
            card.dataset.activity !==
            "guess-my-crush"
        ){

            return;

        }


        card.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                openGuessMyCrushPage();

            }
        );

    }
);


/* =====================================================
GUESS MY CRUSH BACK
===================================================== */

if(guessMyCrushBack){

    guessMyCrushBack.addEventListener(
        "click",
        closeGuessMyCrushPage
    );

}


if(crushGameClose){

    crushGameClose.addEventListener(
        "click",
        closeCrushGame
    );

}


if(crushGameBackdrop){

    crushGameBackdrop.addEventListener(
        "click",
        closeCrushGame
    );

}


/* =====================================================
INCOMING CRUSH → BACK
===================================================== */

if(incomingCrushBack){

    incomingCrushBack.addEventListener(
        "click",
        closeIncomingCrushes
    );

}


if(incomingCrushBackdrop){

    incomingCrushBackdrop.addEventListener(
        "click",
        closeIncomingCrushes
    );

}


/* =====================================================
REVEAL MODAL
===================================================== */

if(crushRevealClose){

    crushRevealClose.addEventListener(
        "click",
        closeRevealModal
    );

}


if(crushRevealBackdrop){

    crushRevealBackdrop.addEventListener(
        "click",
        closeRevealModal
    );

}


/* =====================================================
ESCAPE KEY
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if(event.key !== "Escape") return;

        if(
            crushGameModal &&
            crushGameModal.classList.contains("active")
        ){

            closeCrushGame();
            return;

        }

        if(
            crushRevealModal &&
            crushRevealModal.classList.contains("active")
        ){

            closeRevealModal();
            return;

        }

        if(
            incomingCrushView &&
            incomingCrushView.classList.contains("active")
        ){

            closeIncomingCrushes();

        }

    }
);

/* =====================================================
   MODULE: CRUSH NAMING SYSTEM
===================================================== */


/* -----------------------------------------------------
   ELEMENT REFERENCES
----------------------------------------------------- */

const crushNameModal =
    document.getElementById("crush-name-modal");

const crushNameBackdrop =
    document.getElementById("crush-name-modal-backdrop");

const crushNameClose =
    document.getElementById("crush-name-close");

const crushNameCancel =
    document.getElementById("crush-name-cancel");

const crushNameSave =
    document.getElementById("crush-name-save");

const crushNameInput =
    document.getElementById("crush-name-input");


/* -----------------------------------------------------
   STORAGE
----------------------------------------------------- */

const CRUSH_NAMES_STORAGE_KEY =
    "secretCrushNames";


function getCrushNames(){

    try{

        return JSON.parse(
            localStorage.getItem(
                CRUSH_NAMES_STORAGE_KEY
            )
        ) || {};

    }catch(error){

        console.error(
            "Unable to load crush names:",
            error
        );

        return {};

    }

}


function saveCrushNames(names){

    localStorage.setItem(
        CRUSH_NAMES_STORAGE_KEY,
        JSON.stringify(names)
    );

}


/* -----------------------------------------------------
   CURRENT CRUSH
----------------------------------------------------- */

let currentNamingCrushId = null;


/* -----------------------------------------------------
   OPEN NAMING MODAL
----------------------------------------------------- */

function openCrushNameModal(crushId){

    if(
        !crushNameModal ||
        !crushNameInput
    ){
        return;
    }


    currentNamingCrushId = crushId;


    const names =
        getCrushNames();


    crushNameInput.value =
        names[crushId] || "";


    crushNameModal.classList.add(
        "active"
    );


    crushNameModal.setAttribute(
        "aria-hidden",
        "false"
    );


    setTimeout(() => {

        crushNameInput.focus();

        crushNameInput.select();

    },120);

}


/* -----------------------------------------------------
   CLOSE NAMING MODAL
----------------------------------------------------- */

function closeCrushNameModal(){

    if(!crushNameModal){
        return;
    }


    crushNameModal.classList.remove(
        "active"
    );


    crushNameModal.setAttribute(
        "aria-hidden",
        "true"
    );


    currentNamingCrushId = null;

}


/* -----------------------------------------------------
   SAVE NAME
----------------------------------------------------- */

function saveCurrentCrushName(){

    if(
        !currentNamingCrushId ||
        !crushNameInput
    ){
        return;
    }


    const name =
        crushNameInput.value.trim();


    if(!name){

        crushNameInput.focus();

        return;
    }


    const names =
        getCrushNames();


    names[currentNamingCrushId] =
        name;


    saveCrushNames(names);


    updateCrushNames(
        currentNamingCrushId,
        name
    );


    /*
     * The Guess My Crush list card only carries
     * data-game-id, not data-crush-id, so
     * updateCrushNames() above can't reach it —
     * re-render the list so it picks up the new
     * saved name immediately too.
     */

    if(typeof renderActiveGames === "function"){

        renderActiveGames();

    }


    closeCrushNameModal();

}
/* -----------------------------------------------------
   UPDATE EVERY INSTANCE OF THIS CRUSH
----------------------------------------------------- */

function updateCrushNames(
    crushId,
    name
){

    const elements =
        document.querySelectorAll(
            `[data-crush-id="${crushId}"]`
        );


    elements.forEach(element => {

        const display =
            element.querySelector(
                ".crush-display-name"
            );


        if(display){

            display.textContent =
                name;

        }


const trigger =
            element.querySelector(
                ".crush-name-trigger"
            );


        if(trigger){

            trigger.textContent =
                "Edit Name";

        }


        const customNameBox =
            element.querySelector(
                ".crush-game-custom-name strong"
            );


        if(customNameBox){

            customNameBox.textContent =
                name;

        }

    });

}

/* -----------------------------------------------------
   LOAD SAVED NAMES
----------------------------------------------------- */

function loadCrushNames(){

    const names =
        getCrushNames();


    Object.entries(names)
        .forEach(
            ([crushId,name]) => {

                updateCrushNames(
                    crushId,
                    name
                );

            }
        );

}


/* -----------------------------------------------------
   NAME BUTTONS
----------------------------------------------------- */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".crush-name-trigger"
            );


        if(!button){
            return;
        }


        const crushCard =
            button.closest(
                "[data-crush-id]"
            );


        if(!crushCard){
            return;
        }


        const crushId =
            crushCard.dataset.crushId;


        openCrushNameModal(
            crushId
        );

    }
);


/* -----------------------------------------------------
   SAVE
----------------------------------------------------- */

if(crushNameSave){

    crushNameSave.addEventListener(
        "click",
        saveCurrentCrushName
    );

}


/* -----------------------------------------------------
   CANCEL / CLOSE
----------------------------------------------------- */

if(crushNameCancel){

    crushNameCancel.addEventListener(
        "click",
        closeCrushNameModal
    );

}


if(crushNameClose){

    crushNameClose.addEventListener(
        "click",
        closeCrushNameModal
    );

}


if(crushNameBackdrop){

    crushNameBackdrop.addEventListener(
        "click",
        closeCrushNameModal
    );

}


/* -----------------------------------------------------
   ENTER TO SAVE
----------------------------------------------------- */

if(crushNameInput){

    crushNameInput.addEventListener(
        "keydown",
        event => {

            if(
                event.key === "Enter"
            ){

                event.preventDefault();

                saveCurrentCrushName();

            }

        }
    );

}


/* -----------------------------------------------------
   INITIAL LOAD
----------------------------------------------------- */

loadCrushNames();

/* =====================================================
MODULE: GAME HISTORY — DUMMY COMPLETED GAMES
===================================================== */

const gameHistoryData = {

    won: [

        {
            id: "game-win-001",

            name: "Claire",

            className: "Very Attractive",

            date: "August 23, 2026",

            result: "won",

            identity: {
                name: "Revealed after winning",
                year: "2nd Year",
                school: "Kenyatta University",
                faculty: "Medicine"
            },

            levels: [

                {
                    title: "Level 1",

                    questions: [

                        {
                            question:
                                "Which activity does this person enjoy?",
                            answer:
                                "Listening to music",
                            correct: true
                        },

                        {
                            question:
                                "Where did you first meet?",
                            answer:
                                "Around campus",
                            correct: true
                        },

                        {
                            question:
                                "What sport do they enjoy?",
                            answer:
                                "Basketball",
                            correct: true
                        }

                    ]
                },

                {
                    title: "Level 2",

                    questions: [

                        {
                            question:
                                "What is their favourite type of music?",
                            answer:
                                "R&B",
                            correct: true
                        },

                        {
                            question:
                                "Which place do they enjoy visiting?",
                            answer:
                                "The library",
                            correct: true
                        },

                        {
                            question:
                                "What colour do they usually wear?",
                            answer:
                                "Blue",
                            correct: true
                        }

                    ]
                },

                {
                    title: "Final Level",

                    questions: [

                        {
                            question:
                                "Where did you first properly talk?",
                            answer:
                                "Student centre",
                            correct: true
                        },

                        {
                            question:
                                "Who was your crush?",
                            answer:
                                "Claire",
                            correct: true
                        }

                    ]
                }

            ]
        }

    ],


    lost: [

        {
            id: "game-loss-001",

            name: "Library Girl",

            className: "Attractive",

            date: "August 20, 2026",

            result: "lost",

            identity: {
                name: "Still hidden",
                year: "2nd Year",
                school: "Kenyatta University",
                faculty: "Hidden"
            },

            levels: [

                {
                    title: "Level 1",

                    questions: [

                        {
                            question:
                                "Which hobby does this person enjoy?",
                            answer:
                                "Reading",
                            correct: true
                        },

                        {
                            question:
                                "What sport do they enjoy?",
                            answer:
                                "Football",
                            correct: true
                        },

                        {
                            question:
                                "Where might you have met them?",
                            answer:
                                "Library",
                            correct: false
                        }

                    ]
                },

                {
                    title: "Level 2",

                    questions: [

                        {
                            question:
                                "What is their favourite music?",
                            answer:
                                "Afrobeats",
                            correct: false
                        },

                        {
                            question:
                                "What is their favourite spot?",
                            answer:
                                "Cafeteria",
                            correct: false
                        },

                        {
                            question:
                                "What was the golden clue?",
                            answer:
                                "You see me almost every week",
                            correct: false
                        }

                    ]
                }

            ]
        },

        {
            id: "game-loss-002",

            name: "Mystery",

            className: "Normal",

            date: "August 17, 2026",

            result: "lost",

            identity: {
                name: "Hidden",
                year: "1st Year",
                school: "Hidden",
                faculty: "Business"
            },

            levels: [

                {
                    title: "Level 1",

                    questions: [

                        {
                            question:
                                "Which hobby does this person have?",
                            answer:
                                "Photography",
                            correct: true
                        },

                        {
                            question:
                                "Which sport do they like?",
                            answer:
                                "Football",
                            correct: false
                        },

                        {
                            question:
                                "Where did you meet?",
                            answer:
                                "Campus",
                            correct: false
                        }

                    ]
                }

            ]
        }

    ]

};


/* =====================================================
RENDER GAME HISTORY
===================================================== */

let currentGameHistoryTab = "won";


function renderGameHistory(){

    if(!gameHistoryList){
        return;
    }


    const games =
        gameHistoryData[currentGameHistoryTab] || [];


    if(currentGameHistoryTab === "won"){

        const count =
            document.getElementById(
                "game-history-won-count"
            );

        if(count){
            count.textContent =
                gameHistoryData.won.length;
        }

    }


    if(currentGameHistoryTab === "lost"){

        const count =
            document.getElementById(
                "game-history-lost-count"
            );

        if(count){
            count.textContent =
                gameHistoryData.lost.length;
        }

    }


    const wonCount =
        document.getElementById(
            "game-history-won-count"
        );

    const lostCount =
        document.getElementById(
            "game-history-lost-count"
        );


    if(wonCount){
        wonCount.textContent =
            gameHistoryData.won.length;
    }

    if(lostCount){
        lostCount.textContent =
            gameHistoryData.lost.length;
    }


    if(!games.length){

        gameHistoryList.innerHTML = `

            <div class="game-history-empty">

                <div class="game-history-empty-icon">
                    🎮
                </div>

                <h3>
                    No completed games yet
                </h3>

                <p>
                    Games you win or lose will appear
                    here once they are finished.
                </p>

            </div>

        `;

        return;
    }


    gameHistoryList.innerHTML =
        games.map(game => {

            const dots =
                game.levels
                    .flatMap(level => level.questions)
                    .map(question => `
                        <span
                            class="
                                game-history-progress-dot
                                ${question.correct
                                    ? "correct"
                                    : "wrong"}
                            "
                        ></span>
                    `)
                    .join("");


            return `

                <button
                    type="button"
                    class="game-history-card"
                    data-history-game-id="${game.id}"
                >

                    <div
                        class="
                            game-history-avatar
                            hidden-avatar
                        "
                    >
                        ${game.result === "won"
                            ? "♥"
                            : "?"}
                    </div>


                    <div
                        class="game-history-card-content"
                    >

                        <div
                            class="game-history-card-top"
                        >

                            <span
                                class="game-history-card-name"
                            >
                                ${game.name}
                            </span>

                            <span
                                class="
                                    game-history-result
                                    ${game.result}
                                "
                            >
                                ${game.result === "won"
                                    ? "WON"
                                    : "LOST"}
                            </span>

                        </div>


                        <div
                            class="game-history-card-meta"
                        >

                            <span>
                                ${game.className}
                            </span>

                            <span>
                                ${game.date}
                            </span>

                        </div>


                        <div
                            class="
                                game-history-card-progress
                            "
                        >
                            ${dots}
                        </div>

                    </div>


                    <span
                        class="game-history-card-arrow"
                    >
                        ›
                    </span>

                </button>

            `;

        })
        .join("");


    gameHistoryList
        .querySelectorAll(".game-history-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const gameId =
                        card.dataset.historyGameId;

                    openGameHistoryDetail(
                        gameId
                    );

                }
            );

        });

}


/* =====================================================
OPEN GAME HISTORY DETAIL
===================================================== */

function openGameHistoryDetail(gameId){

    const allGames = [
        ...gameHistoryData.won,
        ...gameHistoryData.lost
    ];


    const game =
        allGames.find(
            item => item.id === gameId
        );


    if(!game){
        return;
    }


    gameHistoryList.hidden = true;


    if(gameHistoryDetail){
        gameHistoryDetail.hidden = false;
    }


    if(!gameHistoryDetailCard){
        return;
    }


    const identityHTML = Object.entries(
        game.identity
    )
        .map(
            ([label,value]) => `

                <div
                    class="
                        game-history-identity-item
                    "
                >

                    <span>
                        ${label}
                    </span>

                    <strong>
                        ${value}
                    </strong>

                </div>

            `
        )
        .join("");


    const levelsHTML =
        game.levels.map(level => {

            const questionsHTML =
                level.questions.map(question => `

                    <div
                        class="game-history-question"
                    >

                        <div
                            class="
                                game-history-question-result
                                ${question.correct
                                    ? "correct"
                                    : "wrong"}
                            "
                        >
                            ${question.correct
                                ? "✓"
                                : "✕"}
                        </div>


                        <div
                            class="
                                game-history-question-text
                            "
                        >

                            ${question.question}

                            <div
                                class="
                                    game-history-question-answer
                                "
                            >
                                Answer:
                                ${question.answer}
                            </div>

                        </div>

                    </div>

                `)
                .join("");


            return `

                <div class="game-history-level">

                    <div
                        class="
                            game-history-level-title
                        "
                    >

                        <strong>
                            ${level.title}
                        </strong>

                        <span>
                            ${
                                level.questions
                                    .filter(q => q.correct)
                                    .length
                            } /
                            ${level.questions.length}
                            correct
                        </span>

                    </div>


                    ${questionsHTML}

                </div>

            `;

        })
        .join("");


    const retryHTML =
        game.result === "lost"
            ? `

                <div
                    class="game-history-retry"
                >

                    <h3>
                        Want another chance?
                    </h3>

                    <p>
                        Try playing this crush game
                        again when another free trial
                        becomes available, or use coins
                        for another attempt.
                    </p>

                    <button
                        type="button"
                        class="game-history-retry-button"
                        onclick="handleGameRetry('${game.id}')"
                    >
                        Try Again
                    </button>

                </div>

            `
            : "";


    gameHistoryDetailCard.innerHTML = `

        <div
            class="game-history-detail-header"
        >

            <div
                class="game-history-detail-person"
            >

                <div
                    class="game-history-detail-avatar"
                >
                    ${game.result === "won"
                        ? "♥"
                        : "?"}
                </div>


                <div>

                    <h2>
                        ${game.name}
                    </h2>

                    <p>
                        ${game.className}
                        ·
                        ${
                            game.result === "won"
                                ? "Game Won"
                                : "Game Lost"
                        }
                    </p>

                </div>

            </div>

        </div>


        <div
            class="game-history-identity"
        >

            <div
                class="game-history-section-label"
            >
                Revealed Information
            </div>


            <div
                class="game-history-identity-grid"
            >
                ${identityHTML}
            </div>

        </div>


        <div
            class="game-history-questions"
        >

            <div
                class="game-history-section-label"
            >
                Your Game Performance
            </div>

            ${levelsHTML}

        </div>


        ${retryHTML}

    `;

}


/* =====================================================
GAME HISTORY — CLOSE DETAIL
===================================================== */

if(gameHistoryDetailBack){

    gameHistoryDetailBack.addEventListener(
        "click",
        () => {

            if(gameHistoryDetail){
                gameHistoryDetail.hidden = true;
            }

            if(gameHistoryList){
                gameHistoryList.hidden = false;
            }

        }
    );

}


/* =====================================================
GAME HISTORY — TABS
===================================================== */

gameHistoryTabs.forEach(tab => {

    tab.addEventListener(
        "click",
        () => {

            gameHistoryTabs.forEach(
                item =>
                    item.classList.remove("active")
            );


            tab.classList.add("active");


            currentGameHistoryTab =
                tab.dataset.historyTab;


            if(gameHistoryDetail){
                gameHistoryDetail.hidden = true;
            }

            if(gameHistoryList){
                gameHistoryList.hidden = false;
            }


            renderGameHistory();

        }
    );

});


/* =====================================================
OPEN GAME HISTORY PAGE
===================================================== */

function openGameHistoryPage(){

    document
        .querySelectorAll(".app-page")
        .forEach(page => {

            page.classList.remove("active");

        });


    if(!gameHistoryPage){
        return;
    }


    closeSideMenu();


    gameHistoryPage.classList.add("active");


    if(gameHistoryDetail){
        gameHistoryDetail.hidden = true;
    }


    if(gameHistoryList){
        gameHistoryList.hidden = false;
    }


    gameHistoryPage.scrollTop = 0;


    setActiveNavigation("");


    hideAppNavigation();


    renderGameHistory();

}


/* =====================================================
GAME HISTORY — BACK TO HOME
===================================================== */





if (gameHistoryBackButton) {
    
    gameHistoryBackButton.addEventListener(
        "click",
        () => {
            
            gameHistoryPage.classList.remove(
                "active"
            );
            
            openHomepage();
            openSideMenu();
            
            
        }
    );
    
}


/* =====================================================
GAME HISTORY — RETRY PLACEHOLDER
===================================================== */

function handleGameRetry(gameId){

    const game =
        [
            ...gameHistoryData.won,
            ...gameHistoryData.lost
        ]
        .find(item => item.id === gameId);


    if(!game){
        return;
    }


    alert(
        "The retry system will connect to the Guess My Crush game later. For now, this completed game remains safely in your history."
    );

}

/* =====================================================
MODULE: POST — CREATE MOMENT + MY SPACE
===================================================== */

const postTopButton =
    document.getElementById("post-top-button");

const postSpacePage =
    document.getElementById("post-space-page");

const postSpaceBack =
    document.getElementById("post-space-back");

const postSpaceTrack =
    document.getElementById("post-space-track");

const momentText =
    document.getElementById("moment-text");

const momentCharacterCount =
    document.getElementById("moment-character-count");

const chooseGalleryButton =
    document.getElementById("choose-gallery-button");

const takePictureButton =
    document.getElementById("take-picture-button");


const momentImagePreview =
    document.getElementById("moment-image-preview");

const postMomentButton =
    document.getElementById("post-moment-button");

const myPostsGrid =
    document.getElementById("my-posts-grid");

const myPostCount =
    document.getElementById("my-post-count");

const mySpaceAvatar =
    document.getElementById("my-space-avatar");

const postUserAvatar =
    document.getElementById("post-user-avatar");

const postUserName =
    document.getElementById("post-user-name");

const mySpaceName =
    document.getElementById("my-space-name");

const mySpaceInstitution =
    document.getElementById("my-space-institution");

const mySpaceAcademic =
    document.getElementById("my-space-academic");

const mySpaceInterests =
    document.getElementById("my-space-interests");


/* =====================================================
OPEN POST PAGE
===================================================== */

function openPostSpace(){

    document
        .querySelectorAll(".app-page")
        .forEach(page => {

            page.classList.remove("active");

        });


    if(!postSpacePage){
        return;
    }


    postSpacePage.classList.add("active");


    /*
     * The Post interface has its own horizontal
     * navigation, so the normal bottom navigation
     * stays hidden while inside it.
     */

    hideAppNavigation();


    loadPostSpaceProfile();
    loadProfileAbout();


    /*
     * Always start on Create Moment.
     */

    if(postSpaceTrack){

        postSpaceTrack.scrollTo({
            left:0,
            behavior:"instant"
        });

    }


    updatePostPagination("create");

}


/* =====================================================
CLOSE POST PAGE
===================================================== */

if(postSpaceBack){

    postSpaceBack.addEventListener(
        "click",
        () => {

            if(postSpacePage){
                postSpacePage.classList.remove(
                    "active"
                );
            }

            openHomepage();

        }
    );

}


/* =====================================================
TOP POST BUTTON
===================================================== */

if(postTopButton){

    postTopButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            openPostSpace();

        }
    );

}


/* =====================================================
LOAD PROFILE INFORMATION
===================================================== */

function loadPostSpaceProfile(){

    const savedProfile =
        localStorage.getItem(
            "secretCrushProfile"
        );


    let profile = null;


    try{

        profile =
            savedProfile
                ? JSON.parse(savedProfile)
                : null;

    }catch(error){

        profile = null;

    }


    if(!profile){

        return;

    }


    const name =
        profile.name || "You";


    const institution =
        profile.institution ||
        "My Institution";


    const year =
        profile.year ||
        "My Year";


    const faculty =
        profile.faculty ||
        "My Faculty";


    if(postUserName){
    postUserName.textContent =
        name;

    const postUserMeta =
        document.querySelector(
            "#post-user-name"
        )?.parentElement
        ?.querySelector("small");

    if(postUserMeta){

        postUserMeta.textContent =
            `${institution} • ${faculty} • ${year}`;

    }
}


    if(mySpaceName){
        mySpaceName.textContent =
            name;
    }


    if(mySpaceInstitution){
        mySpaceInstitution.textContent =
            institution;
    }


    if(mySpaceAcademic){

        mySpaceAcademic.textContent =
            `${year} · ${faculty}`;

    }


    if(profile.profilePicture){

        if(postUserAvatar){
            postUserAvatar.src =
                profile.profilePicture;
        }

        if(mySpaceAvatar){
            mySpaceAvatar.src =
                profile.profilePicture;
        }

    }


    if(mySpaceInterests){

        mySpaceInterests.innerHTML = "";


        const interests =
            Array.isArray(profile.interests)
                ? profile.interests
                : [];


        interests.forEach(
            interest => {

                const tag =
                    document.createElement("span");

                tag.className =
                    "my-space-interest";

                tag.textContent =
                    interest;

                mySpaceInterests.appendChild(
                    tag
                );

            }
        );

    }

}


/* =====================================================
CHARACTER COUNTER
===================================================== */

if(momentText){

    momentText.addEventListener(
        "input",
        () => {

            const length =
                momentText.value.length;


            if(momentCharacterCount){

                momentCharacterCount.textContent =
                    `${length}/300`;

            }

        }
    );

}


/* =====================================================
MODULE: MOMENT VIDEO STORAGE
Stores video files separately from post metadata.
Future backend migration: replace this storage adapter
with an upload API and save the returned media URL/ID.
===================================================== */

const SC_MOMENT_MEDIA_DB = "SecretCrushMomentMedia";
const SC_MOMENT_MEDIA_STORE = "videos";
let SC_MOMENT_MEDIA_DB_PROMISE = null;
const SC_MOMENT_VIDEO_URLS = new Map();

function SC_Moment_OpenMediaDB() {
    if (SC_MOMENT_MEDIA_DB_PROMISE) {
        return SC_MOMENT_MEDIA_DB_PROMISE;
    }

    SC_MOMENT_MEDIA_DB_PROMISE = new Promise((resolve, reject) => {
        const request = indexedDB.open(SC_MOMENT_MEDIA_DB, 1);

        request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains(SC_MOMENT_MEDIA_STORE)) {
                db.createObjectStore(SC_MOMENT_MEDIA_STORE, {
                    keyPath: "id"
                });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
            SC_MOMENT_MEDIA_DB_PROMISE = null;
            reject(request.error);
        };
    });

    return SC_MOMENT_MEDIA_DB_PROMISE;
}

async function SC_Moment_SaveVideo(file, id) {
    const db = await SC_Moment_OpenMediaDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(
            SC_MOMENT_MEDIA_STORE,
            "readwrite"
        );

        transaction.objectStore(SC_MOMENT_MEDIA_STORE).put({
            id,
            blob: file,
            type: file.type || "video/mp4",
            name: file.name || "moment-video"
        });

        transaction.oncomplete = () => resolve(id);
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
    });
}

async function SC_Moment_GetVideoURL(id) {
    if (!id) return "";

    if (SC_MOMENT_VIDEO_URLS.has(id)) {
        return SC_MOMENT_VIDEO_URLS.get(id);
    }

    const db = await SC_Moment_OpenMediaDB();

    const record = await new Promise((resolve, reject) => {
        const transaction = db.transaction(
            SC_MOMENT_MEDIA_STORE,
            "readonly"
        );

        const request = transaction.objectStore(
            SC_MOMENT_MEDIA_STORE
        ).get(id);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });

    if (!record || !record.blob) return "";

    const url = URL.createObjectURL(record.blob);
    SC_MOMENT_VIDEO_URLS.set(id, url);

    return url;
}

async function SC_Moment_HydrateVideoElements(root = document) {
    const videos = root.querySelectorAll(
        "video[data-moment-video-id]"
    );

    for (const video of videos) {
        const id = video.dataset.momentVideoId;

        if (!id || video.dataset.mediaReady === "true") continue;

        try {
            const url = await SC_Moment_GetVideoURL(id);

            if (!url) continue;

            video.src = url;
video.dataset.mediaReady = "true";
video.load();

if (video.classList.contains("sc-feed-moment-video")) {
    const panel = video.closest(".sc-feed-moment-panel");

    if (panel) {
        const rect = panel.getBoundingClientRect();
        const visible =
            rect.top < window.innerHeight &&
            rect.bottom > 0;
        if (visible) {
            SC_VT_Play(video);
        }
    }
}
        } catch (error) {
            console.error("Could not load moment video:", error);
        }
    }
}

function SC_Moment_FormatDuration(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

    const total = Math.floor(seconds);
    const minutes = Math.floor(total / 60);
    const remaining = total % 60;

    return `${minutes}:${String(remaining).padStart(2, "0")}`;
}



/* =====================================================
MOMENT MEDIA — GALLERY + CAMERA
===================================================== */

const momentGalleryInput =
    document.getElementById("moment-gallery-input");

const momentCameraInput =
    document.getElementById("moment-camera-input");


/* =====================================================
GALLERY
===================================================== */

if(chooseGalleryButton){

    chooseGalleryButton.addEventListener(
        "click",
        () => {

            if(momentGalleryInput){

                momentGalleryInput.value = "";

                momentGalleryInput.click();

            }

        }
    );

}


/* =====================================================
CAMERA
===================================================== */

if(takePictureButton){

    takePictureButton.addEventListener(
        "click",
        () => {

            if(momentCameraInput){

                momentCameraInput.value = "";

                momentCameraInput.click();

            }

        }
    );

}



/* =====================================================
MODULE: SELECT MOMENT IMAGE OR VIDEO
===================================================== */

let selectedMomentMediaFile = null;
let selectedMomentMediaType = "";

function processMomentImage(file) {
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
        alert("Choose an image or video.");
        return;
    }

    if (isVideo && file.size > 100 * 1024 * 1024) {
        alert("Please choose a video smaller than 100 MB.");
        return;
    }

    if (!momentImagePreview) return;

    selectedMomentMediaFile = file;
    selectedMomentMediaType = isVideo ? "video" : "image";

    const previewURL = URL.createObjectURL(file);

    momentImagePreview.hidden = false;

    if (isVideo) {
        momentImagePreview.innerHTML = `
            <div class="moment-video-preview-wrap">
                <video
                    id="moment-video-preview-player"
                    src="${previewURL}"
                    controls
                    playsinline
                    preload="metadata"
                ></video>

                <span
                    class="moment-video-preview-duration"
                    id="moment-video-preview-duration"
                >0:00</span>
            </div>

            <button
                type="button"
                class="remove-moment-image"
                id="remove-moment-image"
                aria-label="Remove selected video"
            >×</button>
        `;

        const previewVideo = document.getElementById(
            "moment-video-preview-player"
        );

        previewVideo.addEventListener("loadedmetadata", () => {
            const durationLabel = document.getElementById(
                "moment-video-preview-duration"
            );

            if (durationLabel) {
                durationLabel.textContent =
                    SC_Moment_FormatDuration(previewVideo.duration);
            }
        }, { once: true });

  
    } else {
        const reader = new FileReader();

        reader.onload = () => {
            momentImagePreview.innerHTML = `
                <img
                    src="${reader.result}"
                    alt="Moment image preview"
                >

                <button
                    type="button"
                    class="remove-moment-image"
                    id="remove-moment-image"
                    aria-label="Remove selected image"
                >×</button>
            `;
        };

        reader.readAsDataURL(file);
    }

}

if (momentGalleryInput) {
    momentGalleryInput.addEventListener("change", event => {
        processMomentImage(event.target.files?.[0]);
    });
}

if (momentCameraInput) {
    momentCameraInput.addEventListener("change", event => {
        processMomentImage(event.target.files?.[0]);
    });
}


/* =====================================================
REMOVE SELECTED IMAGE
===================================================== */

document.addEventListener(
    "click",
    event => {

        if(
            event.target.closest(
                "#remove-moment-image"
            )
        ){

            if(momentImagePreview){

                momentImagePreview.hidden =
                    true;

                momentImagePreview.innerHTML =
                    "";

            }
            
            selectedMomentMediaFile = null;
selectedMomentMediaType = "";
            


            if(momentGalleryInput){
                momentGalleryInput.value = "";
            }


            if(momentCameraInput){
                momentCameraInput.value = "";
            }

        }

    }
);
/* =====================================================
CREATE MOMENT
===================================================== */

/* =====================================================
MODULE: CREATE IMAGE OR VIDEO MOMENT
===================================================== */

if (postMomentButton) {
    postMomentButton.addEventListener("click", async event => {
        event.preventDefault();

        const text = momentText?.value?.trim() || "";
        const profile = getCurrentProfile() || {};

        const image =
            selectedMomentMediaType === "image"
                ? momentImagePreview?.querySelector("img")?.src || ""
                : "";

        const hasVideo =
            selectedMomentMediaType === "video" &&
            selectedMomentMediaFile instanceof File;

        if (!text && !image && !hasVideo) {
            alert("Add some text, a photo or a video before posting.");
            return;
        }

        postMomentButton.disabled = true;

        try {
            const postId =
                "moment-" +
                Date.now() +
                "-" +
                Math.random().toString(36).slice(2, 8);

            let videoMediaId = "";
            let videoDuration = 0;

            if (hasVideo) {
                videoMediaId = postId + "-video";

                const previewVideo = document.getElementById(
                    "moment-video-preview-player"
                );

                if (previewVideo && Number.isFinite(previewVideo.duration)) {
                    videoDuration = previewVideo.duration;
                }

                await SC_Moment_SaveVideo(
                    selectedMomentMediaFile,
                    videoMediaId
                );
            }

            const post = SC_ProfileSync_HydratePost({
                id: postId,
                ownerId: profile.userId || "",
                userId: profile.userId || "",
                name: profile.name || "You",
                username: profile.username || "",
                institution: profile.institution || "",
                faculty: profile.faculty || "",
                year: profile.year || "",
                gender: profile.gender || "",
                profilePicture: profile.profilePicture || "",
                about: profile.about || "",
                interests: Array.isArray(profile.interests)
                    ? [...profile.interests]
                    : [],
                text,
                image,
                mediaType: hasVideo ? "video" : image ? "image" : "text",
                videoMediaId,
                videoDuration,
                caption: "",
                likes: 0,
                createdAt: new Date().toISOString(),
                isUserPost: true
            });

            if (!saveMomentPost(post)) {
                throw new Error("Could not save the post metadata.");
            }

            renderMyPost(post, true);
            renderPostInFeed(post, true);

            clearMomentComposer();
            updateMyPostCount();
            updatePostPagination("space");

            if (postSpaceTrack) {
                postSpaceTrack.scrollTo({
                    left: postSpaceTrack.clientWidth,
                    behavior: "smooth"
                });
            }
        } catch (error) {
            console.error("Moment upload failed:", error);
            alert(
                "The moment could not be saved. Please try again. " +
                (error?.message || "")
            );
        } finally {
            postMomentButton.disabled = false;
        }
    });
}



/* =====================================================
   CURRENT PROFILE
   ===================================================== */

function getCurrentProfile(){

    const savedProfile =
        localStorage.getItem(
            "secretCrushProfile"
        );


    if(!savedProfile){
        return null;
    }


    try{

        const profile =
            JSON.parse(
                savedProfile
            );


        /*
         * Every user needs one permanent identity.
         *
         * Older profiles created before this system
         * existed will receive an ID automatically.
         */

        if(!profile.userId){

            profile.userId =
                "user-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .slice(2,8);


            localStorage.setItem(
                "secretCrushProfile",
                JSON.stringify(profile)
            );

        }


        return profile;

    }catch(error){

        console.error(
            "Secret Crush: Could not read current profile.",
            error
        );

        return null;

    }

}

/* =====================================================
   MODULE: GLOBAL PROFILE SYNCHRONIZATION

   IMPORTANT:
   Posts, moments, search results and profile cards
   must reference the user's permanent ID rather than
   treating profile information as permanent.

   The current profile is the single source of truth.
   ===================================================== */


function SC_ProfileSync_GetCurrentProfile(){

    return getCurrentProfile();

}


/* -----------------------------------------------------
   HYDRATE A POST WITH THE CURRENT OWNER PROFILE
   ----------------------------------------------------- */

function SC_ProfileSync_HydratePost(post){

    if(!post){
        return null;
    }


    const profile =
        SC_ProfileSync_GetCurrentProfile();


    if(!profile){
        return post;
    }


    const currentUserId =
        profile.userId;


    /*
     * A post belongs to the current user when:
     *
     * 1. Its ownerId matches the current user, OR
     * 2. It is an older user-created post that does
     *    not yet have an ownerId.
     */

    const belongsToCurrentUser =
        post.ownerId === currentUserId ||
        (
            post.isUserPost === true &&
            !post.ownerId
        );


    if(!belongsToCurrentUser){

        return post;

    }


    /*
     * IMPORTANT:
     * We intentionally overwrite the profile fields
     * from the post with the CURRENT profile.
     */

    return {

        ...post,

        ownerId:
            currentUserId,

        userId:
            currentUserId,

        name:
            profile.name || "You",

        username:
            profile.username || "",

        institution:
            profile.institution || "",

        faculty:
            profile.faculty || "",

        year:
            profile.year || "",

        gender:
            profile.gender || "",

        profilePicture:
            profile.profilePicture || "",

        about:
            profile.about || "",

        interests:
            Array.isArray(profile.interests)
                ? [...profile.interests]
                : [],

        isUserPost:
            true

    };

}


/* -----------------------------------------------------
   UPDATE ALL STORED USER POSTS
   ----------------------------------------------------- */

function SC_ProfileSync_UpdateStoredPosts(){

    const profile =
        SC_ProfileSync_GetCurrentProfile();


    if(!profile){
        return;
    }


    let saved = [];


    try{

        saved =
            JSON.parse(
                localStorage.getItem(
                    "secretCrushMoments"
                ) || "[]"
            );


    }catch(error){

        saved = [];

    }


    if(!Array.isArray(saved)){
        saved = [];
    }


    const updated =
        saved.map(
            post =>
                SC_ProfileSync_HydratePost(
                    post
                )
        );


    localStorage.setItem(
        "secretCrushMoments",
        JSON.stringify(updated)
    );

}


/* -----------------------------------------------------
   UPDATE ALREADY-RENDERED FEED CARDS
   ----------------------------------------------------- */

function SC_ProfileSync_RefreshRenderedPosts(){

    const profile =
        SC_ProfileSync_GetCurrentProfile();


    if(!profile){
        return;
    }


    const userId =
        profile.userId;


    const academicParts = [

        profile.institution || "",

        profile.faculty || "",

        profile.year
            ? `${profile.year} Year`
            : ""

    ].filter(Boolean);


    const academicText =
        academicParts.join(" • ");


    /*
     * FEED
     */

    document
        .querySelectorAll(
            ".feed-card[data-owner-id]"
        )
        .forEach(card => {

            if(
                card.dataset.ownerId !==
                userId
            ){

                return;

            }


            const image =
                card.querySelector(
                    ".feed-user-info img"
                );


            const name =
                card.querySelector(
                    ".feed-user-info h3"
                );


            const academic =
                card.querySelector(
                    ".feed-user-info p"
                );


            if(image){

                image.src =
                    profile.profilePicture ||
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%2314141d'/%3E%3Ctext x='50' y='58' text-anchor='middle' fill='%23ffffff' font-size='40'%3E?%3C/text%3E%3C/svg%3E";

                image.alt =
                    profile.name ||
                    "You";

            }


            if(name){

                name.textContent =
                    profile.name ||
                    "You";

            }


            if(academic){

                academic.textContent =
                    academicText;

            }


            card.dataset.school =
                profile.institution || "";

            card.dataset.institution =
                profile.institution || "";

            card.dataset.faculty =
                profile.faculty || "";

            card.dataset.year =
                profile.year || "";

            card.dataset.gender =
                profile.gender || "";

        });


    /*
     * HOMEPAGE USER POSTS
     */

    document
        .querySelectorAll(
            ".home-user-post[data-owner-id]"
        )
        .forEach(card => {

            if(
                card.dataset.ownerId !==
                userId
            ){

                return;

            }


            const image =
                card.querySelector(
                    ".home-post-user-info img"
                );


            const name =
                card.querySelector(
                    ".home-post-user-info h3"
                );


            const academic =
                card.querySelector(
                    ".home-post-user-info p"
                );


            if(image){

                image.src =
                    profile.profilePicture ||
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%2314141d'/%3E%3Ctext x='50' y='58' text-anchor='middle' fill='%23ffffff' font-size='40'%3E?%3C/text%3E%3C/svg%3E";

                image.alt =
                    profile.name ||
                    "You";

            }


            if(name){

                name.textContent =
                    profile.name ||
                    "You";

            }


            if(academic){

                academic.textContent =
                    academicText;

            }

        });

}


/* -----------------------------------------------------
   MASTER PROFILE SYNCHRONIZATION
   ----------------------------------------------------- */

function SC_ProfileSync_RefreshAll(){

    const profile =
        SC_ProfileSync_GetCurrentProfile();


    if(!profile){
        return;
    }


    /*
     * First update stored posts.
     */

    SC_ProfileSync_UpdateStoredPosts();


    /*
     * Then update interfaces that directly display
     * the current profile.
     */

    if(
        typeof loadProfilePage ===
        "function"
    ){

        loadProfilePage();

    }


    if(
        typeof loadHomepageProfile ===
        "function"
    ){

        loadHomepageProfile();

    }


    if(
        typeof updateMomentProfileAbout ===
        "function"
    ){

        updateMomentProfileAbout();

    }


    /*
     * Finally update cards that are already visible
     * on screen.
     */

    SC_ProfileSync_RefreshRenderedPosts();


    /*
     * Refresh search data if the search interface
     * happens to be open.
     */

    if(
        typeof SC_Search_RenderUsers ===
        "function"
    ){

        const searchInput =
            document.getElementById(
                "feed-user-search-input"
            );


        if(searchInput){

            SC_Search_RenderUsers(
                searchInput.value || ""
            );

        }

    }

}


/* =====================================================
   MOMENT PROFILE ABOUT
   ===================================================== */

function updateMomentProfileAbout(){

    const aboutElement =
        document.getElementById(
            "moment-profile-about"
        );

    if(!aboutElement){
        return;
    }


    const profile =
        getCurrentProfile();


    const about =
        profile?.about?.trim();


    if(about){

        aboutElement.textContent =
            about;

    }else{

        aboutElement.textContent =
            "Add an About to your profile";

    }

}



/* =====================================================
SAVE MOMENT
===================================================== */

/* =====================================================
   SAVE MOMENT
   ===================================================== */

function saveMomentPost(post){

    if(!post){

        console.error(
            "SECRET CRUSH: No post supplied."
        );

        return false;

    }


    try{

        const savedMoments =
            localStorage.getItem(
                "secretCrushMoments"
            );


        const allMoments =
            savedMoments
                ? JSON.parse(savedMoments)
                : [];


        if(!Array.isArray(allMoments)){

            throw new Error(
                "secretCrushMoments is not an array."
            );

        }


        allMoments.push(post);


        localStorage.setItem(
            "secretCrushMoments",
            JSON.stringify(allMoments)
        );


        console.log(
            "SECRET CRUSH: MOMENT SAVED SUCCESSFULLY",
            allMoments
        );


        return true;


    }
    catch(error){

    console.error(
        "Secret Crush: Failed to save moment.",
        error
    );

    alert(
        "Moment storage error:\n\n" +
        "Name: " + (error.name || "Unknown") +
        "\nMessage: " + (error.message || "No message")
    );

    return false;

}

}
/* =====================================================
CLEAR COMPOSER
===================================================== */

function clearMomentComposer(){

    if(momentText){

        momentText.value = "";

    }


    if(momentCharacterCount){

        momentCharacterCount.textContent =
            "0/300";

    }


    if(momentImagePreview){

        momentImagePreview.hidden =
            true;

        momentImagePreview.innerHTML =
            "";

    }


    if(momentGalleryInput){
        momentGalleryInput.value = "";
    }


    if(momentCameraInput){
        momentCameraInput.value = "";
    }

}


/* =====================================================
   PROFILE ABOUT EDITOR
   ===================================================== */

const mySpaceAbout =
    document.getElementById(
        "my-space-about"
    );

const editAboutButton =
    document.getElementById(
        "edit-about-button"
    );

const aboutEditorModal =
    document.getElementById(
        "about-editor-modal"
    );

const aboutEditorBackdrop =
    document.getElementById(
        "about-editor-backdrop"
    );

const aboutEditorClose =
    document.getElementById(
        "about-editor-close"
    );

const aboutInput =
    document.getElementById(
        "about-input"
    );

const aboutCharacterCount =
    document.getElementById(
        "about-character-count"
    );

const saveAboutButton =
    document.getElementById(
        "save-about-button"
    );


/* =====================================================
   LOAD ABOUT
   ===================================================== */
function loadProfileAbout(){

    const profile =
        getCurrentProfile();

    const aboutElement =
        document.getElementById(
            "my-space-about"
        );

    if(!aboutElement){
        return;
    }

    const about =
        profile &&
        typeof profile.about === "string"
            ? profile.about.trim()
            : "";

    if(about){

        aboutElement.textContent =
            about;

    }else{

        aboutElement.textContent =
            "Tell us something about yourself";

    }

}


/* =====================================================
   ABOUT COUNTER
   ===================================================== */

function updateAboutCharacterCount(){

    if(
        !aboutInput ||
        !aboutCharacterCount
    ){
        return;
    }

    aboutCharacterCount.textContent =
        `${aboutInput.value.length}/150`;

}


/* =====================================================
   OPEN ABOUT EDITOR
   ===================================================== */

function openAboutEditor(){

    const profile =
        getCurrentProfile() || {};

    if(aboutInput){

        aboutInput.value =
            profile.about || "";

    }

    updateAboutCharacterCount();

    if(aboutEditorModal){

        aboutEditorModal.hidden =
            false;

    }

}


/* =====================================================
   CLOSE ABOUT EDITOR
   ===================================================== */

function closeAboutEditor(){

    if(aboutEditorModal){

        aboutEditorModal.hidden =
            true;

    }

}


/* =====================================================
   EDIT ABOUT BUTTON
   ===================================================== */

if(editAboutButton){

    editAboutButton.addEventListener(
        "click",
        openAboutEditor
    );

}


/* =====================================================
   ABOUT CHARACTER COUNTER
   ===================================================== */

if(aboutInput){

    aboutInput.addEventListener(
        "input",
        updateAboutCharacterCount
    );

}


/* =====================================================
   CLOSE ABOUT EDITOR
   ===================================================== */

if(aboutEditorClose){

    aboutEditorClose.addEventListener(
        "click",
        closeAboutEditor
    );

}

if(aboutEditorBackdrop){

    aboutEditorBackdrop.addEventListener(
        "click",
        closeAboutEditor
    );

}


/* =====================================================
   SAVE ABOUT
   ===================================================== */

if(saveAboutButton){

    saveAboutButton.addEventListener(
        "click",
        () => {

            const profile =
                getCurrentProfile();

            if(!profile){

                alert(
                    "Your profile could not be found."
                );

                return;

            }


            const about =
                aboutInput?.value?.trim() || "";


            profile.about =
                about;


            try{

                localStorage.setItem(
                    "secretCrushProfile",
                    JSON.stringify(profile)
                );
                
                
                

            }catch(error){

                console.error(
                    "Secret Crush: Could not save About.",
                    error
                );

                alert(
                    "Your About could not be saved. Please try again."
                );

                return;

            }


            SC_ProfileSync_RefreshAll();
            
            

/* SIDEQUEST — WRITE ABOUT */

if(
    about &&
    typeof SCQ_RecordAction === "function"
){

    SCQ_RecordAction(
        "about_saved"
    );

}

closeAboutEditor();

        }
    );

}


/* =====================================================
MOMENT CAPTION EDITOR
===================================================== */

const momentCaptionModal =
    document.getElementById(
        "moment-caption-modal"
    );

const momentCaptionBackdrop =
    document.getElementById(
        "moment-caption-backdrop"
    );

const momentCaptionClose =
    document.getElementById(
        "moment-caption-close"
    );

const momentCaptionInput =
    document.getElementById(
        "moment-caption-input"
    );

const momentCaptionCount =
    document.getElementById(
        "moment-caption-count"
    );

const saveMomentCaption =
    document.getElementById(
        "save-moment-caption"
    );

let activeCaptionPost = null;


/* =====================================================
OPEN CAPTION EDITOR
===================================================== */

function openMomentCaptionEditor(post){

    activeCaptionPost =
        post;


    const existingCaption =
        post.querySelector(
            ".my-post-caption"
        )?.textContent || "";


    if(momentCaptionInput){

        momentCaptionInput.value =
            existingCaption;

    }


    updateCaptionCounter();


    if(momentCaptionModal){

        momentCaptionModal.hidden =
            false;

    }

}


/* =====================================================
CAPTION COUNTER
===================================================== */

function updateCaptionCounter(){

    if(
        !momentCaptionInput ||
        !momentCaptionCount
    ){

        return;

    }


    momentCaptionCount.textContent =
        `${momentCaptionInput.value.length}/150`;

}


if(momentCaptionInput){

    momentCaptionInput.addEventListener(
        "input",
        updateCaptionCounter
    );

}


/* =====================================================
SAVE CAPTION
===================================================== */

if(saveMomentCaption){

    saveMomentCaption.addEventListener(
        "click",
        () => {

            if(!activeCaptionPost){
                return;
            }


            const postId =
                activeCaptionPost.dataset.postId;


            const caption =
                momentCaptionInput
                    ?.value
                    .trim() || "";


            /* -----------------------------------------
               UPDATE MY SPACE
            ----------------------------------------- */

            let captionElement =
                activeCaptionPost.querySelector(
                    ".my-post-caption"
                );


            if(caption){

                if(!captionElement){

                    captionElement =
                        document.createElement(
                            "p"
                        );

                    captionElement.className =
                        "my-post-caption";


                    const content =
                        activeCaptionPost.querySelector(
                            ".my-post-card-content"
                        );


                    if(content){

                        content.prepend(
                            captionElement
                        );

                    }

                }


                captionElement.textContent =
                    caption;

            }else{

                captionElement?.remove();

            }


            /* -----------------------------------------
               UPDATE FEED
            ----------------------------------------- */

            const feedPost =
                document.querySelector(
                    `.feed-card[data-post-id="${postId}"]`
                );


            if(feedPost){

                let feedCaption =
                    feedPost.querySelector(
                        ".feed-caption"
                    );


                if(!feedCaption){

                    feedCaption =
                        document.createElement(
                            "p"
                        );

                    feedCaption.className =
                        "feed-caption";


                    const header =
                        feedPost.querySelector(
                            ".feed-user"
                        );


                    if(header){

                        header.after(
                            feedCaption
                        );

                    }

                }


                feedCaption.textContent =
                    caption;


                feedCaption.hidden =
                    !caption;

            }


            /* -----------------------------------------
               SAVE CAPTION TO STORAGE
            ----------------------------------------- */

            let saved = [];


            try{

                saved =
                    JSON.parse(
                        localStorage.getItem(
                            "secretCrushMoments"
                        ) || "[]"
                    );

            }catch(error){

                saved = [];

            }


            saved =
                saved.map(
                    post => {

                        if(
                            post.id ===
                            postId
                        ){

                            return {

                                ...post,

                                caption:
                                    caption

                            };

                        }


                        return post;

                    }
                );


            localStorage.setItem(
                "secretCrushMoments",
                JSON.stringify(saved)
            );


            closeMomentCaptionEditor();


        }
    );

}


/* =====================================================
CLOSE CAPTION EDITOR
===================================================== */

function closeMomentCaptionEditor(){

    activeCaptionPost =
        null;


    if(momentCaptionModal){

        momentCaptionModal.hidden =
            true;

    }

}


momentCaptionClose?.addEventListener(
    "click",
    closeMomentCaptionEditor
);


momentCaptionBackdrop?.addEventListener(
    "click",
    closeMomentCaptionEditor
);






/* =====================================================
ESCAPE POST TEXT
===================================================== */

function escapePostHTML(text){

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}


/* =====================================================
THREE-DOT POST MENUS
===================================================== */

document.addEventListener(
    "click",
    event => {

        /* ---------------------------------------------
           OPEN / CLOSE POST MENU
        --------------------------------------------- */

        const menuButton =
            event.target.closest(
                ".my-post-menu-button"
            );


        if(menuButton){

            event.stopPropagation();


            const postId =
                menuButton.dataset.postMenu;


            document
                .querySelectorAll(
                    ".my-post-menu"
                )
                .forEach(
                    menu => {

                        if(
                            menu.dataset.menuFor !==
                            postId
                        ){

                            menu.hidden =
                                true;

                        }

                    }
                );


            const menu =
                document.querySelector(
                    `.my-post-menu[data-menu-for="${postId}"]`
                );


            if(menu){

                menu.hidden =
                    !menu.hidden;

            }


            return;

        }


        /* ---------------------------------------------
           ADD / EDIT CAPTION
        --------------------------------------------- */

        const editButton =
            event.target.closest(
                ".edit-post-option"
            );


        if(editButton){

            event.stopPropagation();


            const postId =
                editButton.dataset.editCaption;


            const post =
                document.querySelector(
                    `.my-post-card[data-post-id="${postId}"]`
                );


            if(post){

                openMomentCaptionEditor(
                    post
                );

            }


            return;

        }

/* ---------------------------------------------
   VIEW LIKES
--------------------------------------------- */

const viewLikesButton =
    event.target.closest(
        ".sc-my-post-likes-option"
    );


if(viewLikesButton){

    event.stopPropagation();


    const postId =
        viewLikesButton.dataset.viewLikes;


    const post =
        SC_Moment_GetStoredPostById(
            postId
        );


    if(post){

        openMomentLikesViewer(
            post
        );

    }


    return;

}





        /* ---------------------------------------------
           DELETE POST
        --------------------------------------------- */

        const deleteButton =
            event.target.closest(
                ".delete-post-option"
            );


        if(deleteButton){

            event.stopPropagation();


            const postId =
                deleteButton.dataset.deletePost;


            const confirmed =
                confirm(
                    "Delete this moment? This cannot be undone."
                );


            if(!confirmed){
                return;
            }


            /* Remove from My Space */

            const myPost =
                document.querySelector(
                    `.my-post-card[data-post-id="${postId}"]`
                );


            if(myPost){

                myPost.remove();

            }


            /* Remove from Feed */

            const feedPost =
                document.querySelector(
                    `.feed-card[data-post-id="${postId}"]`
                );


            if(feedPost){

                feedPost.remove();

            }


            /* Remove from localStorage */

            let saved = [];


            try{

                saved =
                    JSON.parse(
                        localStorage.getItem(
                            "secretCrushMoments"
                        ) || "[]"
                    );

            }catch(error){

                saved = [];

            }


            saved =
                saved.filter(
                    post =>
                        post.id !== postId
                );


            localStorage.setItem(
                "secretCrushMoments",
                JSON.stringify(saved)
            );


            updateMyPostCount();


            return;

        }


        /* ---------------------------------------------
           ARCHIVE POST
        --------------------------------------------- */

        const archiveButton =
            event.target.closest(
                ".archive-post-option"
            );


        if(archiveButton){

            event.stopPropagation();


            const postId =
                archiveButton.dataset.archivePost;


            const post =
                document.querySelector(
                    `.my-post-card[data-post-id="${postId}"]`
                );


            if(post){

                post.classList.toggle(
                    "post-archived"
                );

            }


            return;

        }


        /* ---------------------------------------------
           CLOSE OPEN MENUS
        --------------------------------------------- */

        document
            .querySelectorAll(
                ".my-post-menu"
            )
            .forEach(
                menu => {

                    menu.hidden =
                        true;

                }
            );

    }
);


/* =====================================================
UPDATE POST COUNT
===================================================== */

function updateMyPostCount(){

    if(!myPostsGrid || !myPostCount){
        return;
    }


    const count =
    myPostsGrid.querySelectorAll(
        '.my-post-card[data-real-post="true"]'
    ).length;

    myPostCount.textContent =
        `(${count})`;

}


/* =====================================================
HORIZONTAL PAGINATION
===================================================== */

function updatePostPagination(panel){

    document
        .querySelectorAll(".post-pagination-dot")
        .forEach(dot => {

            dot.classList.remove("active");

        });


    const activeDot =
        document.querySelector(
            `.post-pagination-dot[data-post-jump="${panel}"]`
        );


    if(activeDot){

        activeDot.classList.add(
            "active"
        );

    }

}


/* =====================================================
DETECT HORIZONTAL SWIPE
===================================================== */

if(postSpaceTrack){

    postSpaceTrack.addEventListener(
        "scroll",
        () => {

            const index =
                Math.round(
                    postSpaceTrack.scrollLeft /
                    postSpaceTrack.clientWidth
                );


            updatePostPagination(
                index === 0
                    ? "create"
                    : "space"
            );

        }
    );

}


/* =====================================================
PAGINATION BUTTONS
===================================================== */

document
    .querySelectorAll(".post-pagination-dot")
    .forEach(dot => {

        dot.addEventListener(
            "click",
            () => {

                const destination =
                    dot.dataset.postJump;


                const target =
                    destination === "create"
                        ? 0
                        : postSpaceTrack.clientWidth;


                postSpaceTrack?.scrollTo({

                    left:target,

                    behavior:"smooth"

                });

            }
        );

    });


/* =====================================================
POST PAGE INITIAL COUNT
===================================================== */

updateMyPostCount();

/* =====================================================
RENDER USER MOMENT IN FEED
===================================================== */

function renderPostInFeed(
    post,
    prepend = true
){
    
        post =
        SC_ProfileSync_HydratePost(
            post
        );
        
        post =
    SC_Moment_ApplyLikeState(
        post
    );
        
        

    const feedContent =
        document.querySelector(
            ".feed-content"
        );


    if(!feedContent){
        return;
    }


    /*
     * Prevent duplicate rendering.
     */

    const existing =
        feedContent.querySelector(
            `.feed-card[data-post-id="${post.id}"]`
        );


    if(existing){
        return;
    }


    const article =
        document.createElement(
            "article"
        );


    article.className =
    "feed-card user-created-feed-card";

article.dataset.postId =
    post.id;
    
    article.dataset.ownerId =
    post.ownerId ||
    "";
    
    article.dataset.createdAt =
    post.createdAt ||
    "";


/* =====================================================
FILTER DATA
===================================================== */

article.dataset.school =
    post.institution ||
    "";

article.dataset.institution =
    post.institution ||
    "";

article.dataset.faculty =
    post.faculty ||
    "";

article.dataset.year =
    post.year ||
    "";

article.dataset.gender =
    post.gender ||
    "";

article.dataset.filterUserCard =
    "true";
    


    const academic =
        `${post.institution} • ${post.faculty} • ${post.year}`;

const likedByCurrentUser =
    SC_Moment_IsLikedByCurrentUser(
        post
    );
    
    

    article.innerHTML = `

        <div class="feed-user">

            <div class="feed-user-info">

                <img
                    src="${
                        post.profilePicture ||
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%2314141d'/%3E%3Ctext x='50' y='58' text-anchor='middle' fill='%23ffffff' font-size='40'%3E?%3C/text%3E%3C/svg%3E"
                    }"
                    alt="${escapePostHTML(post.name)}"
                >

                <div>

                    <h3>
                        ${escapePostHTML(post.name)}
                    </h3>

                    <p>
                        ${escapePostHTML(academic)}
                    </p>

                </div>

            </div>


<span>
    ${
        post.createdAt
            ? SC_Moment_FormatDateTime(
                post.createdAt
            )
            : "Date unavailable"
    }
    ⋮
</span>



        </div>


        ${
            post.caption
                ? `
                    <p class="feed-caption">
                        ${escapePostHTML(post.caption)}
                    </p>
                `
                : `
                    <p
                        class="feed-caption"
                        hidden
                    ></p>
                `
        }


  
${
    post.videoMediaId
        ? `
            <div class="feed-media feed-video-media">
                <video
                    data-moment-video-id="${escapePostHTML(post.videoMediaId)}"
                    class="feed-post-video"
                    playsinline
                    preload="metadata"
                    muted
                ></video>

                <button
                    type="button"
                    class="feed-video-open"
                    aria-label="Open video"
                >
                    ▶
                </button>

                <span class="feed-video-duration">
                    ${SC_Moment_FormatDuration(post.videoDuration || 0)}
                </span>
            </div>
        `
        : post.image
            ? `
                <div class="feed-media">
                    <img
                        src="${post.image}"
                        alt="Moment"
                    >
                </div>
            `
            : ""
}



        ${
            post.text
                ? `
                    <div class="feed-post-text">
                        ${escapePostHTML(post.text)}
                    </div>
                `
                : ""
        }


        <div class="feed-actions">

<button
    type="button"
    class="like-action"
    data-feed-like="${post.id}"
>
    <span class="like-icon">
        ${
            SC_Moment_IsLikedByCurrentUser(post)
                ? "♥"
                : "♡"
        }
    </span>

    <span class="like-count">
        ${post.likes || 0}
    </span>
</button>



            <button
                type="button"
                class="crush-action"
                data-send-crush="${post.id}"
            >
                ♡ Send Crush
            </button>


            <button
                type="button"
                class="note-action"
                data-send-note="${post.id}"
            >
                ▣ Secret Note
            </button>

        </div>

    `;


    if(prepend){

        feedContent.prepend(
            article
        );

    }else{

        feedContent.appendChild(
            article
        );

    }


    attachFeedPostActions(
        article
    );
    
    SC_Moment_HydrateVideoElements(article);

}
/* =====================================================
   RENDER USER MOMENT IN HOME
   ===================================================== */

function renderPostInHome(
    post,
    prepend = true
){
    
        post =
        SC_ProfileSync_HydratePost(
            post
        );
        
        post =
    SC_Moment_ApplyLikeState(
        post
    );
        

    const homeContent =
        document.querySelector(
            ".home-feed-content"
        );


    if(!homeContent){

        return;

    }


    /* ---------------------------------------------
       PREVENT DUPLICATES
       --------------------------------------------- */

    const existing =
        homeContent.querySelector(
            `.home-user-post[data-post-id="${post.id}"]`
        );


    if(existing){

        return;

    }


    /* ---------------------------------------------
       CREATE HOME POST
       --------------------------------------------- */

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "home-user-post";


    article.dataset.postId =
        post.id;
        article.dataset.ownerId =
    post.ownerId ||
    "";
    
    article.dataset.createdAt =
    post.createdAt ||
    "";


    const academic =
        `${post.institution || ""} • ${post.faculty || ""} • ${post.year || ""}`;


    article.innerHTML = `

        <div class="home-post-user">

            <div class="home-post-user-info">

                <img
                    src="${
                        post.profilePicture ||
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%2314141d'/%3E%3Ctext x='50' y='58' text-anchor='middle' fill='%23ffffff' font-size='40'%3E?%3C/text%3E%3C/svg%3E"
                    }"
                    alt="${escapePostHTML(post.name || "You")}"
                >

                <div>

                    <h3>
                        ${escapePostHTML(post.name || "You")}
                    </h3>

                    <p>
                        ${escapePostHTML(academic)}
                    </p>

                </div>

            </div>

        </div>


        ${
            post.image
                ? `
                    <div class="home-post-media">

                        <img
                            src="${post.image}"
                            alt="Moment"
                        >

                    </div>
                `
                : ""
        }


        ${
            post.caption
                ? `
                    <p class="home-post-caption">
                        ${escapePostHTML(post.caption)}
                    </p>
                `
                : ""
        }


        ${
            post.text
                ? `
                    <div class="home-post-text">
                        ${escapePostHTML(post.text)}
                    </div>
                `
                : ""
        }


        <div class="home-post-actions">

<button
    type="button"
    class="like-action"
    data-feed-like="${post.id}"
>
    <span class="like-icon">
        ${
            SC_Moment_IsLikedByCurrentUser(post)
                ? "♥"
                : "♡"
        }
    </span>

    <span class="like-count">
        ${post.likes || 0}
    </span>
</button>



            <button
                type="button"
                class="crush-action"
                data-send-crush="${post.id}"
            >
                ♡ Send Crush
            </button>


            <button
                type="button"
                class="note-action"
                data-send-note="${post.id}"
            >
                ▣ Secret Note
            </button>

        </div>

    `;


    if(prepend){

        homeContent.prepend(
            article
        );

    }else{

        homeContent.appendChild(
            article
        );

    }

}

/* =====================================================
   LOAD SAVED USER MOMENTS
   Restores posts after refresh
   ===================================================== */

/* =====================================================
   LOAD SAVED USER MOMENTS
   ===================================================== */

function loadSavedMoments(){

    let saved = [];


    try{

        const stored =
            localStorage.getItem(
                "secretCrushMoments"
            );


        console.log(
            "SECRET CRUSH: STORED MOMENTS:",
            stored
        );


        if(stored){

            saved =
                JSON.parse(stored);

        }


        if(!Array.isArray(saved)){

            saved = [];

        }

    }catch(error){

        console.error(
            "SECRET CRUSH: FAILED TO LOAD MOMENTS",
            error
        );

        saved = [];

    }


    console.log(
        "SECRET CRUSH: MOMENTS TO RESTORE:",
        saved.length
    );


    saved.forEach(
        post => {

            if(!post || !post.id){

                return;

            }


            renderMyPost(
                post,
                false
            );


            renderPostInFeed(
                post,
                false
            );


            /*
             * Home is temporarily disabled
             * until we verify the actual Home HTML.
             */

        }
    );


    updateMyPostCount();

}
/* =====================================================
RENDER MY POST
===================================================== */


/* =====================================================
   MY STORED MOMENT HELPERS
===================================================== */

function SC_Moment_GetStoredPostById(
    postId
){

    try{

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "secretCrushMoments"
                ) || "[]"
            );


        if(
            Array.isArray(
                saved
            )
        ){

            return saved.find(
                post =>
                    String(
                        post.id
                    ) ===
                    String(
                        postId
                    )
            ) || null;

        }

    }catch(error){

        return null;

    }


    return null;

}


function SC_Moment_GetOwnStoredPosts(){

    try{

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "secretCrushMoments"
                ) || "[]"
            );


        if(
            Array.isArray(
                saved
            )
        ){

            return saved
                .map(
                    post =>
                        SC_Moment_ApplyLikeState(
                            post
                        )
                )
                .sort(
                    (
                        a,
                        b
                    ) =>
                        new Date(
                            b.createdAt ||
                            0
                        ) -
                        new Date(
                            a.createdAt ||
                            0
                        )
                );

        }

    }catch(error){

        return [];

    }


    return [];

}



function renderMyPost(
    post,
    prepend = true
){

    if(!myPostsGrid){

        return;

    }


    post =
        SC_Moment_ApplyLikeState(
            post
        );


    const existing =
        myPostsGrid.querySelector(
            `.my-post-card[data-post-id="${post.id}"]`
        );


    if(existing){

        return;

    }


    const article =
        document.createElement(
            "article"
        );


    article.className =
        "my-post-card";


    article.dataset.postId =
        post.id;


    article.dataset.realPost =
        "true";


    article.dataset.createdAt =
        post.createdAt ||
        "";


    article.innerHTML = `

  
        <div class="my-post-image my-post-media">

            ${
                post.videoMediaId
                    ? `
                        <video
                            class="my-space-post-video"
                            data-moment-video-id="${escapePostHTML(post.videoMediaId)}"
                            playsinline
                            muted
                            preload="metadata"
                        ></video>

                        <span class="my-space-video-badge">
                            ▶ VIDEO
                        </span>

                        <span class="my-space-video-duration">
                            ${SC_Moment_FormatDuration(post.videoDuration || 0)}
                        </span>
                    `
                    : post.image
                        ? `
                            <img
                                src="${post.image}"
                                alt="My moment"
                            >
                        `
                        : "💭"
            }

        </div>



        <div
            class="my-post-card-content"
        >

            ${
                post.caption

                    ?

                    `
                    <p
                        class="my-post-caption"
                    >
                        ${escapePostHTML(
                            post.caption
                        )}
                    </p>
                    `

                    :

                    post.text

                        ?

                        `
                        <p>
                            ${escapePostHTML(
                                post.text
                            )}
                        </p>
                        `

                        :

                        ""
            }


            <div
                class="
                    my-post-card-meta
                "
            >

<span class="my-post-likes">
    ♥
    <span class="my-post-likes-count">
        ${post.likes || 0}
    </span>
</span>
                <small>
                    ${
                        post.createdAt
                            ? SC_Moment_FormatDateTime(
                                post.createdAt
                            )
                            : "Date unavailable"
                    }
                </small>

            </div>

        </div>


        <button
            type="button"
            class="my-post-menu-button"
            data-post-menu="${post.id}"
            aria-label="Post options"
        >
            ⋮
        </button>


        <div
            class="my-post-menu"
            data-menu-for="${post.id}"
            hidden
        >

            <button
                type="button"
                class="edit-post-option"
                data-edit-caption="${post.id}"
            >
                ✎ Add / Edit Caption
            </button>


            <button
                type="button"
                class="sc-my-post-likes-option"
                data-view-likes="${post.id}"
            >
                ♥ View Likes
            </button>


            <button
                type="button"
                class="delete-post-option"
                data-delete-post="${post.id}"
            >
                🗑 Delete Post
            </button>


            <button
                type="button"
                class="archive-post-option"
                data-archive-post="${post.id}"
            >
                ▣ Archive Post
            </button>

        </div>

    `;


    if(prepend){

        myPostsGrid.prepend(
            article
        );

    }else{

        myPostsGrid.appendChild(
            article
        );

    }


    /*
     * Tapping the actual moment opens the
     * horizontal moment viewer.
     */

    const image =
        article.querySelector(
            ".my-post-image"
        );


    image?.addEventListener(
        "click",
        () => {

            const saved =
                SC_Moment_GetStoredPostById(
                    post.id
                );


            openMutualProfilePostViewer(
                {
                    id:
                        post.ownerId,

                    name:
                        post.name,

                    username:
                        post.username,

                    posts:
                        saved
                            ? SC_Moment_GetOwnStoredPosts()
                            : [post]

                },
                post,
                0,
                saved
                    ? SC_Moment_GetOwnStoredPosts()
                        .length
                    : 1
            );

        }
    );


    updateMyPostCount();

}


/* =====================================================
LOAD USER MOMENTS ON STARTUP
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadSavedMoments();
        updateMomentProfileAbout();

    }
);
/* =====================================================
   OTHER ACTIVITY — TRANSACTIONS INTERFACE
   ===================================================== */

const transactionsOverlay =
    document.getElementById(
        "transactions-overlay"
    );

const transactionsBackdrop =
    document.getElementById(
        "transactions-backdrop"
    );

const transactionsBackButton =
    document.getElementById(
        "transactions-back-button"
    );

const transactionsCloseButton =
    document.getElementById(
        "transactions-close-button"
    );

const transactionsHorizontalView =
    document.getElementById(
        "transactions-horizontal-view"
    );

const transactionsMainTabs =
    document.querySelectorAll(
        ".transactions-main-tab"
    );


/* =====================================================
   OPEN
   ===================================================== */

function openTransactionsInterface(){

    if(!transactionsOverlay){
        return;
    }

    transactionsOverlay.hidden = false;

document.body.classList.add(
    "transactions-open"
);


/*
 * Always refresh the App Transactions
 * balance whenever the interface opens.
 */

updateAppTransactionsBalance();


/*
 * Also refresh the reward history.
 */

if(
    typeof renderAppRewardTransactions ===
    "function"
){

    renderAppRewardTransactions();

}

if(
    typeof renderAppSpendingTransactions ===
    "function"
){

    renderAppSpendingTransactions();

}


switchTransactionsTab("wallet");
}


/* =====================================================
   CLOSE
   ===================================================== */

function closeTransactionsInterface(){

    if(!transactionsOverlay){
        return;
    }

    transactionsOverlay.hidden = true;

    document.body.classList.remove(
        "transactions-open"
    );
    
    openSideMenu();

}


/* =====================================================
   MAIN TAB SWITCHING
   ===================================================== */
function switchTransactionsTab(tab){

    if(!transactionsHorizontalView){
        return;
    }
if(
        tab === "app" &&
        typeof renderAppRewardTransactions ===
        "function"
    ){

        renderAppRewardTransactions();

    }

    if(
        tab === "app" &&
        typeof renderAppSpendingTransactions ===
        "function"
    ){

        renderAppSpendingTransactions();

    }

    transactionsMainTabs.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.transactionTab === tab
        );

    });


    const targetScreen =
        document.querySelector(
            `[data-transaction-screen="${tab}"]`
        );

    if(!targetScreen){
        return;
    }


    transactionsHorizontalView.scrollTo({

        left:
            targetScreen.offsetLeft,

        behavior:
            "smooth"

    });

}


/* =====================================================
   MAIN TRANSACTION TABS
   ===================================================== */

transactionsMainTabs.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            switchTransactionsTab(
                button.dataset.transactionTab
            );

        }
    );

});


/* =====================================================
   DETECT HORIZONTAL SWIPE
   ===================================================== */

if(transactionsHorizontalView){

    transactionsHorizontalView.addEventListener(
        "scroll",
        () => {

            const screenWidth =
                transactionsHorizontalView.clientWidth;

            if(!screenWidth){
                return;
            }

            const currentIndex =
                Math.round(
                    transactionsHorizontalView.scrollLeft /
                    screenWidth
                );

            const tab =
                currentIndex === 1
                    ? "app"
                    : "wallet";

            transactionsMainTabs.forEach(
                button => {

                    button.classList.toggle(
                        "active",
                        button.dataset.transactionTab === tab
                    );

                }
            );

        }
    );

}


/* =====================================================
   CLOSE BUTTONS
   ===================================================== */

if(transactionsCloseButton){

    transactionsCloseButton.addEventListener(
        "click",
        closeTransactionsInterface
    );

}


if(transactionsBackdrop){

    transactionsBackdrop.addEventListener(
        "click",
        closeTransactionsInterface
    );

}


/* =====================================================
   BACK BUTTON
   ===================================================== */

if(transactionsBackButton){

    transactionsBackButton.addEventListener(
        "click",
        closeTransactionsInterface
    );

}


/* =====================================================
   WALLET SENT / RECEIVED
   ===================================================== */

const walletHistoryTabs =
    document.querySelectorAll(
        ".wallet-history-tab"
    );

const walletHistoryPanels =
    document.querySelectorAll(
        ".wallet-history-panel"
    );


walletHistoryTabs.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const target =
                button.dataset.walletHistory;


            walletHistoryTabs.forEach(tab => {

                tab.classList.toggle(
                    "active",
                    tab === button
                );

            });


            walletHistoryPanels.forEach(
                panel => {

                    panel.classList.toggle(
                        "active",
                        panel.dataset.walletHistoryPanel === target
                    );

                }
            );

        }
    );

});

/* =====================================================
   APP TRANSACTIONS — LIVE BALANCES
   ===================================================== */



/* =====================================================
   APP TRANSACTIONS — LIVE BALANCES
   ===================================================== */

function updateAppTransactionsBalance(){

    /*
     * Coins use the exact same balance as
     * the Homepage and Bank.
     */

    const coins =
        Number(
            localStorage.getItem(
                "secretCrushCoins"
            )
        );


    const safeCoins =
        Number.isFinite(coins)
            ? coins
            : 0;


    const appCoins =
        document.getElementById(
            "app-bank-coins"
        );


    if(appCoins){

        appCoins.textContent =
            safeCoins.toLocaleString();

    }


    /*
     * Games use the same reward balance
     * used by the Daily Rewards system.
     */

    const games =
        Number(
            localStorage.getItem(
                "secretCrushFreeGames"
            )
        );


    const safeGames =
        Number.isFinite(games)
            ? Math.max(0, games)
            : 0;


    const appGames =
        document.getElementById(
            "app-bank-games"
        );


    if(appGames){

        appGames.textContent =
            safeGames.toLocaleString();

    }

}

/* =====================================================
   FORMAT A REWARD TIMESTAMP
   ===================================================== */

function formatRewardTimestamp(timestamp){

    const date =
        new Date(timestamp);

    if(Number.isNaN(date.getTime())){
        return "";
    }

    const now = new Date();

    const isToday =
        date.toDateString() ===
        now.toDateString();

    const time =
        date.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });

    if(isToday){
        return `Today, ${time}`;
    }

    const dateLabel =
        date.toLocaleDateString([], {
            month: "short",
            day: "numeric"
        });

    return `${dateLabel}, ${time}`;

}


/* =====================================================
   RENDER REWARD TRANSACTIONS
   (REWARDS RECEIVED TAB)
   ===================================================== */

function renderAppRewardTransactions(){

    const list =
        document.getElementById(
            "app-reward-transactions-list"
        );

    if(!list){
        return;
    }

    const transactions =
        getAppRewardTransactions();

    if(!transactions.length){

        list.innerHTML = `

            <div class="game-history-empty">

                <div class="game-history-empty-icon">
                    🎁
                </div>

                <h3>
                    No rewards yet
                </h3>

                <p>
                    Coins and free games you claim
                    will appear here.
                </p>

            </div>

        `;

        return;

    }
    
    list.innerHTML =
        transactions.map(transaction => {

            /*
             * Reward entries can come from either of
             * two ledger writers that share the same
             * storage key, so normalize both shapes:
             *
             * Shape A: { type:"coin"|"free-game", amount, reason }
             * Shape B: { type:"coin-reward"|"game-reward", coins, games, title }
             */

            const isGameReward =
                transaction.type === "game-reward" ||
                transaction.type === "free-game";

            const coinsAmount =
                Number(transaction.coins) ||
                (
                    transaction.type === "coin"
                        ? Number(transaction.amount)
                        : 0
                ) ||
                0;

            const gamesAmount =
                Number(transaction.games) ||
                (
                    isGameReward
                        ? Number(transaction.amount)
                        : 0
                ) ||
                0;

            const icon =
                isGameReward
                    ? "🎟️"
                    : "🪙";

            const amountLabel =
                isGameReward
                    ? `+${gamesAmount} 🎟️`
                    : `+${coinsAmount} 🪙`;

            const title =
                transaction.title ||
                transaction.reason ||
                "Reward Received";

            return `

                <article class="app-transaction-item">

                    <span class="app-transaction-icon">
                        ${icon}
                    </span>

                    <div>

                        <strong>
                            ${escapePostHTML(title)}
                        </strong>

                        <small>
                            ${formatRewardTimestamp(transaction.createdAt)}
                        </small>

                    </div>

                    <b class="transaction-positive">
                        ${amountLabel}
                    </b>

                </article>

            `;

        }).join("");





}
/* =====================================================
   APP REWARDS / SPENDING
   ===================================================== */

const appHistoryTabs =
    document.querySelectorAll(
        ".app-history-tab"
    );

const appHistoryPanels =
    document.querySelectorAll(
        ".app-history-panel"
    );


appHistoryTabs.forEach(button => {
button.addEventListener(
        "click",
        () => {

            const target =
                button.dataset.appHistory;

            if(
                target === "spending" &&
                typeof renderAppSpendingTransactions ===
                "function"
            ){

                renderAppSpendingTransactions();

            }


            appHistoryTabs.forEach(tab => {
                tab.classList.toggle(
                    "active",
                    tab === button
                );

            });


            appHistoryPanels.forEach(
                panel => {

                    panel.classList.toggle(
                        "active",
                        panel.dataset.appHistoryPanel === target
                    );

                }
            );

        }
    );

});


/* =====================================================
   TEMPORARY WALLET BUTTONS
   ===================================================== */

const walletTopUpButton =
    document.getElementById(
        "wallet-top-up-button"
    );

const walletWithdrawButton =
    document.getElementById(
        "wallet-withdraw-button"
    );


if(walletTopUpButton){

    walletTopUpButton.addEventListener(
        "click",
        () => {

            alert(
                "Top Up will be connected to the Secret Crush wallet system later."
            );

        }
    );

}


if(walletWithdrawButton){

    walletWithdrawButton.addEventListener(
        "click",
        () => {

            alert(
                "Withdraw will be connected to the Secret Crush wallet system later."
            );

        }
    );

}


/* =====================================================
   ESCAPE KEY
   ===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if(
            event.key === "Escape" &&
            transactionsOverlay &&
            !transactionsOverlay.hidden
        ){

            closeTransactionsInterface();

        }

    }
);

/* =====================================================
   MODULE: SIDEQUEST ENGINE
   ===================================================== */

/*
 * This is the first working version of the quest engine.
 *
 * Currently implemented:
 *
 * 1. First Steps
 *    - Write an About
 *
 * 2. Timed Quests
 *    - Send 2 Secret Notes
 *
 * The same engine will later power the other quests.
 */


/* =====================================================
   CONFIGURATION
   ===================================================== */
const SCQ_QUEST_CONFIG = {

    /* =====================================================
       FIRST STEPS
       ===================================================== */

    writeAbout: {
        id: "first_write_about",
        type: "first",
        requirement: 1,
        rewardCoins: 10,
        title: "Write an About",
        description: "Tell people a little about yourself.",
        action: "about_saved"
    },

    followFive: {
        id: "first_follow_five",
        type: "first",
        requirement: 5,
        rewardCoins: 10,
        title: "Follow 5 People",
        description: "Follow five people you would like to know.",
        action: "person_followed"
    },

    sendThreeCrushes: {
        id: "first_send_three_crushes",
        type: "first",
        requirement: 3,
        rewardCoins: 15,
        title: "Send 3 Crushes",
        description: "Send three crushes to people you like.",
        action: "crush_sent"
    },

    secretNoteAndLikes: {
        id: "first_secret_note_and_likes",
        type: "first",
        requirement: 6,
        rewardCoins: 15,
        title: "Secret Note + Like 5 Moments",
        description: "Send one secret note and like five moments.",
        action: "secret_note_and_moments"
    },

    likeThreeStories: {
        id: "first_like_three_stories",
        type: "first",
        requirement: 3,
        rewardCoins: 10,
        title: "Like 3 Stories",
        description: "Like three stories.",
        action: "story_liked"
    },


    /* =====================================================
       TIMED QUESTS
       ===================================================== */

    secretNotes: {
        id: "timed_secret_notes",
        type: "timed",
        requirement: 2,
        rewardCoins: 15,
        cooldown: 12* 60 * 60 * 1000,
        title: "Send 2 Secret Notes",
        description: "Send two secret notes to people.",
        action: "secret_note_sent"
    },

    timedCrushes: {
        id: "timed_send_three_crushes",
        type: "timed",
        requirement: 3,
        rewardCoins: 15,
        cooldown: 12* 60 * 60 * 1000,
        title: "Send 3 Secret Crushes",
        description: "Send three secret crushes.",
        action: "crush_sent"
    },

    timedMoments: {
        id: "timed_like_five_moments",
        type: "timed",
        requirement: 5,
        rewardCoins: 10,
        cooldown: 12 * 60 * 60 * 1000,
        title: "Like 5 Moments",
        description: "Like five moments.",
        action: "moment_liked"
    },


    /* =====================================================
       ACTIVITY QUESTS
       ===================================================== */

    receiveCrush: {
        id: "activity_receive_crush",
        type: "activity",
        requirement: 1,
        rewardCoins: 10,
        title: "Receive a Crush",
        description: "Someone sent you a secret crush.",
        action: "crush_received"
    },

    mutualCrush: {
        id: "activity_mutual_crush",
        type: "activity",
        requirement: 1,
        rewardCoins: 25,
        title: "Mutual Crush",
        description: "Turn a crush into a mutual crush.",
        action: "mutual_crush"
    },

    gameCompleted: {
        id: "activity_game_completed",
        type: "activity",
        requirement: 1,
        rewardCoins: 20,
        title: "Complete a Crush Game",
        description: "Complete a Guess My Crush game.",
        action: "game_completed"
    }

};


/* =====================================================
   STORAGE
   ===================================================== */

const SCQ_STORAGE_KEY =
    "secretCrushQuestState";


/* =====================================================
   DEFAULT STATE
   ===================================================== */
function SCQ_GetDefaultState(){

    return {

        first_write_about: {
            count: 0,
            status: "available",
            claimed: false,
            cooldownEndsAt: null
        },

        first_follow_five: {
            count: 0,
            status: "available",
            claimed: false,
            cooldownEndsAt: null
        },

        first_send_three_crushes: {
            count: 0,
            status: "available",
            claimed: false,
            cooldownEndsAt: null
        },

        first_secret_note_and_moments: {
            count: 0,
            noteCount: 0,
            momentCount: 0,
            status: "available",
            claimed: false,
            cooldownEndsAt: null
        },

        first_like_three_stories: {
            count: 0,
            status: "available",
            claimed: false,
            cooldownEndsAt: null
        },

        timed_secret_notes: {
            count: 0,
            status: "available",
            claimed: false,
            cooldownEndsAt: null
        },

        timed_send_three_crushes: {
            count: 0,
            status: "available",
            claimed: false,
            cooldownEndsAt: null
        },

        timed_like_five_moments: {
            count: 0,
            status: "available",
            claimed: false,
            cooldownEndsAt: null
        },

        activity_receive_crush: {
            count: 0,
            status: "available",
            claimed: false,
            cooldownEndsAt: null
        },

        activity_mutual_crush: {
            count: 0,
            status: "available",
            claimed: false,
            cooldownEndsAt: null
        },

        activity_game_completed: {
            count: 0,
            status: "available",
            claimed: false,
            cooldownEndsAt: null
        }

    };

}


function SCQ_LoadState(){

    const defaults =
        SCQ_GetDefaultState();

    let stored = null;

    try{

        stored =
            JSON.parse(
                localStorage.getItem(
                    SCQ_STORAGE_KEY
                ) || "null"
            );

    }catch(error){

        stored = null;

    }

    if(
        !stored ||
        typeof stored !== "object"
    ){

        return defaults;

    }

    const state = {
        ...defaults,
        ...stored
    };

    Object.keys(defaults).forEach(
        id => {

            state[id] = {
                ...defaults[id],
                ...(stored[id] || {})
            };

        }
    );

    return state;

}


function SCQ_SaveState(state){

    localStorage.setItem(
        SCQ_STORAGE_KEY,
        JSON.stringify(state)
    );

}


function SCQ_GetConfigById(id){

    return Object.values(
        SCQ_QUEST_CONFIG
    ).find(
        quest =>
            quest.id === id
    ) || null;

}


function SCQ_NormalizeTimedQuest(quest){

    if(
        !quest ||
        quest.status !== "cooldown" ||
        !quest.cooldownEndsAt
    ){

        return quest;

    }

    if(
        Date.now() >=
        Number(quest.cooldownEndsAt)
    ){

        quest.count = 0;
        quest.status = "available";
        quest.claimed = false;
        quest.cooldownEndsAt = null;

    }

    return quest;

}
function SCQ_RecordAction(action){

    const state =
        SCQ_LoadState();

    let changed = false;

    let rewardToShow = null;


    Object.values(
        SCQ_QUEST_CONFIG
    ).forEach(
        config => {

            if(
                config.action !== action
            ){

                return;

            }

            const quest =
                state[config.id];

            if(!quest){

                return;

            }


            if(
                config.type === "timed"
            ){

                SCQ_NormalizeTimedQuest(
                    quest
                );

                if(
                    quest.status === "cooldown"
                ){

                    return;

                }

            }


            if(
                quest.status === "claimed"
            ){

                return;

            }


            /* =========================================
               COMPOSITE QUEST
            ========================================= */

            if(
                config.id ===
                "first_secret_note_and_moments"
            ){

                if(
                    action ===
                    "secret_note_sent"
                ){

                    quest.noteCount =
                        Math.min(
                            1,
                            Number(
                                quest.noteCount
                            ) || 0
                        ) + 1;

                }


                if(
                    action ===
                    "moment_liked"
                ){

                    quest.momentCount =
                        Math.min(
                            5,
                            Number(
                                quest.momentCount
                            ) || 0
                        ) + 1;

                }


                quest.count =
                    Number(
                        quest.noteCount
                    ) +
                    Number(
                        quest.momentCount
                    );


                if(
                    quest.noteCount >= 1 &&
                    quest.momentCount >= 5
                ){

                    quest.status =
                        "claimable";

                    rewardToShow =
                        config.id;

                }else{

                    quest.status =
                        "in_progress";

                }


                changed = true;

                return;

            }


            /* =========================================
               NORMAL / TIMED QUEST
            ========================================= */

            quest.count =
                Math.min(
                    config.requirement,
                    (
                        Number(
                            quest.count
                        ) || 0
                    ) + 1
                );

            changed = true;


            if(
                quest.count >=
                config.requirement
            ){

                quest.status =
                    "claimable";

                rewardToShow =
                    config.id;

            }else{

                quest.status =
                    "in_progress";

            }

        }
    );


    /* =========================================
       SAVE FIRST
    ========================================= */

    if(changed){

        SCQ_SaveState(
            state
        );

        SCQ_Render();


        /* =====================================
           SHOW REWARD AFTER STATE IS SAVED
        ===================================== */

        if(rewardToShow){

            SCQ_ShowReward(
                rewardToShow
            );

        }

    }

}



let SCQ_PendingReward = null;


function SCQ_ShowReward(questId){

    const config =
        SCQ_GetConfigById(
            questId
        );

    if(!config){

        return;

    }

    const state =
        SCQ_LoadState();

    const quest =
        state[questId];

    if(
        !quest ||
        quest.status !== "claimable"
    ){

        return;

    }

    SCQ_PendingReward =
        questId;


    const overlay =
        document.getElementById(
            "sidequest-reward-overlay"
        );

    const title =
        document.getElementById(
            "sidequest-reward-title"
        );

    const description =
        document.getElementById(
            "sidequest-reward-description"
        );

    const amount =
        document.getElementById(
            "sidequest-reward-amount"
        );


    if(!overlay){

        return;

    }


    if(title){

        title.textContent =
            config.title;

    }

    if(description){

        description.textContent =
            config.description;

    }

    if(amount){

        amount.textContent =
            `+${config.rewardCoins}`;

    }

    overlay.hidden = false;

}

function SCQ_ClaimReward(){

    /* =========================================
       MAKE SURE A REWARD IS ACTUALLY PENDING
    ========================================= */

    if(!SCQ_PendingReward){

        return;

    }


    const questId =
        SCQ_PendingReward;


    const config =
        SCQ_GetConfigById(
            questId
        );


    const state =
        SCQ_LoadState();


    const quest =
        state[questId];


    /* =========================================
       VALIDATION
    ========================================= */

    if(
        !config ||
        !quest ||
        quest.status !== "claimable"
    ){

        SCQ_CloseReward();

        return;

    }


    /* =========================================
       GIVE THE COINS
    ========================================= */

    awardSecretCrushCoins(
    config.rewardCoins,
    `${config.title} — Sidequest Reward`
);

updateAllCoinDisplays();


    /* =========================================
       FIRST STEPS / ACTIVITY
       → PERMANENTLY CLAIMED
    ========================================= */

    if(
        config.type === "first" ||
        config.type === "activity"
    ){

        quest.count =
            config.requirement;

        quest.status =
            "claimed";

        quest.claimed =
            true;

        quest.cooldownEndsAt =
            null;

    }


    /* =========================================
       TIMED QUEST
       → START COOLDOWN
    ========================================= */

    if(
        config.type === "timed"
    ){

        quest.count =
            0;

        quest.status =
            "cooldown";

        quest.claimed =
            true;

        quest.cooldownEndsAt =
            Date.now() +
            config.cooldown;

    }
    
    updateAppTransactionsBalance();


    /* =========================================
       SAVE THE NEW QUEST STATE
    ========================================= */

    SCQ_SaveState(
        state
    );


    /* =========================================
       CLOSE REWARD POPUP
    ========================================= */

    SCQ_CloseReward();


    /* =========================================
       REFRESH SIDEQUESTS
    ========================================= */

    SCQ_Render();

}




function SCQ_CloseReward(){

    const overlay =
        document.getElementById(
            "sidequest-reward-overlay"
        );

    if(overlay){

        overlay.hidden = true;

    }

    SCQ_PendingReward =
        null;

}


function SCQ_FormatTime(milliseconds){

    const totalSeconds =
        Math.max(
            0,
            Math.floor(
                milliseconds / 1000
            )
        );

    const days =
        Math.floor(
            totalSeconds / 86400
        );

    const hours =
        Math.floor(
            (
                totalSeconds % 86400
            ) / 3600
        );

    const minutes =
        Math.floor(
            (
                totalSeconds % 3600
            ) / 60
        );

    const seconds =
        totalSeconds % 60;


    if(days > 0){

        return `${days}d ${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

    }


    return [
        String(hours).padStart(2,"0"),
        String(minutes).padStart(2,"0"),
        String(seconds).padStart(2,"0")
    ].join(":");

}


function SCQ_RenderCard(config,state){

    const quest =
        state[config.id];

    if(!quest){

        return;

    }


    if(
        config.type === "timed"
    ){

        SCQ_NormalizeTimedQuest(
            quest
        );

    }


    const card =
        document.getElementById(
            config.card
        );

    if(!card){

        return;

    }


    const progress =
        document.getElementById(
            config.progress
        );

    const progressText =
        document.getElementById(
            config.progressText
        );

    const status =
        document.getElementById(
            config.status
        );

    const button =
        document.getElementById(
            config.button
        );

    const timer =
        config.timer
            ? document.getElementById(
                config.timer
            )
            : null;


    let current =
        Number(
            quest.count
        ) || 0;


    if(
        config.id ===
        "first_secret_note_and_moments"
    ){

        current =
            Number(
                quest.noteCount
            ) +
            Number(
                quest.momentCount
            );

    }


    const percent =
        Math.min(
            100,
            (
                current /
                config.requirement
            ) * 100
        );


    if(progress){

        progress.style.width =
            `${percent}%`;

    }


    if(progressText){

        if(
            config.id ===
            "first_secret_note_and_moments"
        ){

            progressText.textContent =
                `${quest.noteCount || 0} note + ${quest.momentCount || 0} likes`;

        }else{

            progressText.textContent =
                `${current} / ${config.requirement}`;

        }

    }


    if(
        quest.status === "claimable"
    ){

        if(status){

            status.textContent =
                "🎁 Reward ready to claim";

        }

        if(button){

            button.textContent =
                "Reward Ready";

            button.disabled =
                true;

        }

        if(timer){

            timer.hidden =
                true;

        }

        return;

    }


    if(
        quest.status === "claimed"
    ){

        card.classList.add(
            "completed"
        );

        if(status){

            status.textContent =
                "Claimed";

        }

        if(button){

            button.textContent =
                "Claimed";

            button.disabled =
                true;

        }

        return;

    }


    if(
        quest.status === "cooldown"
    ){

        card.classList.add(
            "cooldown"
        );

        if(status){

            status.textContent =
                "Reward claimed — cooling down";

        }

        if(timer){

            timer.hidden =
                false;

            const strong =
                timer.querySelector(
                    "strong"
                );

            if(strong){

                strong.textContent =
                    SCQ_FormatTime(
                        Number(
                            quest.cooldownEndsAt
                        ) -
                        Date.now()
                    );

            }

        }

        if(button){

            button.textContent =
                "Cooling";

            button.disabled =
                true;

        }

        return;

    }


    card.classList.remove(
        "completed",
        "cooldown"
    );


    if(timer){

        timer.hidden =
            true;

    }


    if(status){

        status.textContent =
            current > 0
                ? "In progress"
                : "Available";

    }


    if(button){

        button.textContent =
            "Start";

        button.disabled =
            false;

    }

}


const SCQ_CARD_MAP = {

    first_write_about: {
        card: "quest-write-about",
        progress: "write-about-progress",
        progressText: "write-about-progress-text",
        status: "write-about-status",
        button: "write-about-start"
    },

    first_follow_five: {
        card: "quest-follow-five",
        progress: "follow-five-progress",
        progressText: "follow-five-progress-text",
        status: "follow-five-status",
        button: "follow-five-start"
    },

    first_send_three_crushes: {
        card: "quest-first-three-crushes",
        progress: "first-three-crushes-progress",
        progressText: "first-three-crushes-progress-text",
        status: "first-three-crushes-status",
        button: "first-three-crushes-start"
    },

    first_secret_note_and_moments: {
        card: "quest-note-and-moments",
        progress: "note-and-moments-progress",
        progressText: "note-and-moments-progress-text",
        status: "note-and-moments-status",
        button: "note-and-moments-start"
    },

    first_like_three_stories: {
        card: "quest-three-stories",
        progress: "three-stories-progress",
        progressText: "three-stories-progress-text",
        status: "three-stories-status",
        button: "three-stories-start"
    },

    timed_secret_notes: {
        card: "quest-secret-notes",
        progress: "secret-notes-progress",
        progressText: "secret-notes-progress-text",
        status: "secret-notes-status",
        button: "secret-notes-start",
        timer: "secret-notes-timer"
    },

    timed_send_three_crushes: {
        card: "quest-timed-three-crushes",
        progress: "timed-three-crushes-progress",
        progressText: "timed-three-crushes-progress-text",
        status: "timed-three-crushes-status",
        button: "timed-three-crushes-start",
        timer: "timed-three-crushes-timer"
    },

    timed_like_five_moments: {
        card: "quest-timed-five-moments",
        progress: "timed-five-moments-progress",
        progressText: "timed-five-moments-progress-text",
        status: "timed-five-moments-status",
        button: "timed-five-moments-start",
        timer: "timed-five-moments-timer"
    },

    activity_receive_crush: {
        card: "quest-receive-crush",
        progress: "receive-crush-progress",
        progressText: "receive-crush-progress-text",
        status: "receive-crush-status",
        button: "receive-crush-start"
    },

    activity_mutual_crush: {
        card: "quest-mutual-crush",
        progress: "mutual-crush-progress",
        progressText: "mutual-crush-progress-text",
        status: "mutual-crush-status",
        button: "mutual-crush-start"
    },

    activity_game_completed: {
        card: "quest-game-completed",
        progress: "game-completed-progress",
        progressText: "game-completed-progress-text",
        status: "game-completed-status",
        button: "game-completed-start"
    }

};


function SCQ_Render(){

    const state =
        SCQ_LoadState();


    Object.values(
        SCQ_QUEST_CONFIG
    ).forEach(
        config => {

            const map =
                SCQ_CARD_MAP[
                    config.id
                ];

            if(!map){

                return;

            }

            SCQ_RenderCard(
                {
                    ...config,
                    ...map
                },
                state
            );

        }
    );


    const firstStepIds = [

        "first_write_about",
        "first_follow_five",
        "first_send_three_crushes",
        "first_secret_note_and_moments",
        "first_like_three_stories"

    ];


    const firstStepsSection =
        document.getElementById(
            "first-steps-section"
        );


    if(firstStepsSection){

        firstStepsSection.hidden =
            firstStepIds.every(
                id =>
                    state[id]?.claimed === true
            );

    }

}


function openSidequestsInterface(){

    const overlay =
        document.getElementById(
            "sidequests-overlay"
        );

    if(!overlay){

        return;

    }

    SCQ_Render();

    overlay.hidden =
        false;

    document.body.classList.add(
        "sidequests-open"
    );

}


function closeSidequestsInterface(){

    const overlay =
        document.getElementById(
            "sidequests-overlay"
        );

    if(overlay){

        overlay.hidden =
            true;

    }

    document.body.classList.remove(
        "sidequests-open"
    );

    openSideMenu();

}


function SCQ_StartWriteAbout(){

    closeSidequestsInterface();

    if(
        typeof openAboutEditor ===
        "function"
    ){

        openAboutEditor();

    }

}


function SCQ_StartSecretNotes(){

    closeSidequestsInterface();

    const nav =
        document.querySelector(
            '.nav-item[data-page="feed"]'
        );

    if(nav){

        nav.click();

    }
    
    closeSideMenu();

}


function SCQ_StartCrushes(){

    SCQ_StartSecretNotes();
    closeSideMenu();

}


function SCQ_StartMoments(){

    SCQ_StartSecretNotes();
    closeSideMenu();

}


function SCQ_StartStories(){

    closeSidequestsInterface();
    closeSideMenu();

}


function SCQ_StartFollow(){

    closeSidequestsInterface();
    closeSideMenu();

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        SCQ_Render();


        const starts = {

            "write-about-start":
                SCQ_StartWriteAbout,

            "secret-notes-start":
                SCQ_StartSecretNotes,

            "first-three-crushes-start":
                SCQ_StartCrushes,

            "timed-three-crushes-start":
                SCQ_StartCrushes,

            "note-and-moments-start":
                SCQ_StartMoments,

            "timed-five-moments-start":
                SCQ_StartMoments,

            "three-stories-start":
                SCQ_StartStories,

            "follow-five-start":
                SCQ_StartFollow,

            "receive-crush-start":
                () =>
                    SCQ_StartSecretNotes(),

            "mutual-crush-start":
                () =>
                    SCQ_StartSecretNotes(),

            "game-completed-start":
                () =>
                    SCQ_StartSecretNotes()

        };


        Object.entries(
            starts
        ).forEach(
            ([id,handler]) => {

                const button =
                    document.getElementById(
                        id
                    );

                if(button){

                    button.addEventListener(
                        "click",
                        handler
                    );

                }

            }
        );


        const claim =
            document.getElementById(
                "sidequest-reward-claim"
            );

        if(claim){

            claim.addEventListener(
                "click",
                SCQ_ClaimReward
            );

        }


        const rewardBackdrop =
            document.getElementById(
                "sidequest-reward-backdrop"
            );

        if(rewardBackdrop){

            rewardBackdrop.addEventListener(
                "click",
                SCQ_CloseReward
            );

        }


        const close =
            document.getElementById(
                "sidequests-close"
            );

        if(close){

            close.addEventListener(
                "click",
                closeSidequestsInterface
            );

        }


        const back =
            document.getElementById(
                "sidequests-back"
            );

        if(back){

            back.addEventListener(
                "click",
                closeSidequestsInterface
            );

        }


        const backdrop =
            document.getElementById(
                "sidequests-backdrop"
            );

        if(backdrop){

            backdrop.addEventListener(
                "click",
                closeSidequestsInterface
            );

        }

    }
);


setInterval(
    () => {

        const state =
            SCQ_LoadState();

        let changed = false;


        Object.values(
            SCQ_QUEST_CONFIG
        ).forEach(
            config => {

                if(
                    config.type !== "timed"
                ){

                    return;

                }

                const quest =
                    state[config.id];

                if(!quest){

                    return;

                }

                const before =
                    quest.status;

                SCQ_NormalizeTimedQuest(
                    quest
                );

                if(
                    before !==
                    quest.status
                ){

                    changed = true;

                }

            }
        );


        if(changed){

            SCQ_SaveState(
                state
            );

        }


        const overlay =
            document.getElementById(
                "sidequests-overlay"
            );

        if(
            overlay &&
            !overlay.hidden
        ){

            SCQ_Render();

        }

    },
    1000
);

/* =====================================================
MODULE: HELP & SUPPORT
===================================================== */

const HELP_TOPICS = {

    crush: {

        title:
            "Secret Crush",

        icon:
            "♡",

        description:
            "Everything you need to know about sending and receiving Secret Crushes.",

        faqs:[

            {
                q:
                    "How does Secret Crush work?",

                a:
                    "A Secret Crush lets you show someone that you like them without immediately revealing your identity. The recipient can use the available clues and guessing features to try to discover who sent it."
            },

            {
                q:
                    "How do I send a Secret Crush?",

                a:
                    "Open a person's profile or an eligible moment and choose Send Crush. You can then choose what information you want to reveal and add clues where available."
            },

            {
                q:
                    "What can I reveal?",

                a:
                    "Depending on the crush flow, you may be able to reveal information such as your name, institution, faculty, year of study, profile picture, About and interests."
            },

            {
                q:
                    "What happens if the person guesses me?",

                a:
                    "If the guessing requirements are successfully completed, the relevant reveal or mutual-crush flow can continue."
            }

        ]

    },


    game: {

        title:
            "Guess My Crush",

        icon:
            "🎮",

        description:
            "Learn how the guessing game, clues, levels and attempts work.",

        faqs:[

            {
                q:
                    "How does Guess My Crush work?",

                a:
                    "The recipient progresses through a series of questions and clues to try to identify the person who sent the crush."
            },

            {
                q:
                    "What are the game levels?",

                a:
                    "The game is divided into levels. Successfully answering the required questions allows the player to progress toward the final guess."
            },

            {
                q:
                    "Can I get extra attempts?",

                a:
                    "Additional attempts can be awarded depending on how well you perform in a level. The exact rewards are controlled by the game's rules."
            },

            {
                q:
                    "What happens when the game ends?",

                a:
                    "Completed games move into Game History, while games that are still ongoing remain available through the active Guess My Crush area."
            }

        ]

    },


    rewards: {

        title:
            "Coins, Games & Rewards",

        icon:
            "🪙",

        description:
            "Understand coins, free games, Sidequests and Daily Rewards.",

        faqs:[

            {
                q:
                    "How do I earn coins?",

                a:
                    "Coins can be earned through eligible rewards, Sidequests and other activities supported by Secret Crush."
            },

            {
                q:
                    "How do Daily Rewards work?",

                a:
                    "Daily Rewards encourage you to return to the app regularly. Claiming an available reward adds the corresponding reward to your account."
            },

            {
                q:
                    "What are Sidequests?",

                a:
                    "Sidequests are activities you can complete to earn rewards. Some are first-time quests while others become available again after a cooldown."
            },

            {
                q:
                    "Where can I see my rewards?",

                a:
                    "Your rewards and App Transactions can be viewed from My Space → Transactions → App Transactions."
            }

        ]

    },


    account: {

        title:
            "Account & Profile",

        icon:
            "♙",

        description:
            "Manage your profile and account information.",

        faqs:[

            {
                q:
                    "How do I edit my profile?",

                a:
                    "Open your Profile page and use the available editing controls to update your information."
            },

            {
                q:
                    "How does my About work?",

                a:
                    "Your About is a profile statement. It is separate from the captions attached to individual Moments."
            },

            {
                q:
                    "Can I change my profile picture?",

                a:
                    "Yes. Your profile picture can be changed through the profile editing interface."
            },

            {
                q:
                    "Who can see my profile information?",

                a:
                    "Visibility depends on the information involved and the rules of the particular Secret Crush or social interaction."
            }

        ]

    },


    moments: {

        title:
            "Moments & Stories",

        icon:
            "📷",

        description:
            "Learn how Moments and Stories work.",

        faqs:[

            {
                q:
                    "How do I create a Moment?",

                a:
                    "Open the Post interface, write what is on your mind and optionally add an image from your gallery or camera."
            },

            {
                q:
                    "Can I delete a Moment?",

                a:
                    "Yes. Your own Moments have post-management controls that allow you to delete them."
            },

            {
                q:
                    "What can other people do with my Moment?",

                a:
                    "Depending on the interaction rules, other users can like a Moment, send a Secret Crush or send a Secret Note."
            },

            {
                q:
                    "What are Stories?",

                a:
                    "Stories are temporary social posts designed for quick updates and interactions. Their full behaviour will be connected to the Stories system."
            }

        ]

    },


    wallet: {

        title:
            "Wallet & Gifts",

        icon:
            "💳",

        description:
            "Find answers about your wallet, gifts, coins and transactions.",

        faqs:[

            {
                q:
                    "Where can I see my wallet?",

                a:
                    "Open My Space → Transactions and choose Wallet."
            },

            {
                q:
                    "Where can I see my App Transactions?",

                a:
                    "Open My Space → Transactions and choose App Transactions."
            },

            {
                q:
                    "What is the difference between the wallet and App Bank?",

                a:
                    "The App Bank manages Secret Crush's in-app currency such as coins and games. The wallet is intended for currency-based transactions such as future gifts and withdrawals."
            },

            {
                q:
                    "Can I send gifts?",

                a:
                    "Secret Crush is planned to support gifts that can carry real monetary value. The complete gifting and withdrawal system will be connected when the wallet infrastructure is implemented."
            }

        ]

    },


    safety: {

        title:
            "Safety & Privacy",

        icon:
            "🛡",

        description:
            "Information about keeping your Secret Crush experience safe.",

        faqs:[

            {
                q:
                    "Can I report someone?",

                a:
                    "Yes. Use Report a User from Help & Support when you need to report inappropriate behaviour."
            },

            {
                q:
                    "Can I report a problem?",

                a:
                    "Yes. Use Report a Problem to tell the support team when something in the app is not working correctly."
            },

            {
                q:
                    "Are reports confidential?",

                a:
                    "Reports are intended to be handled confidentially and used to investigate safety or technical concerns."
            },

            {
                q:
                    "Can I block someone?",

                a:
                    "Blocking will be part of the account safety controls as the user-management system is expanded."
            }

        ]

    },


    technical: {

        title:
            "Technical Issues",

        icon:
            "⚙",

        description:
            "Having trouble with the app? Start here.",

        faqs:[

            {
                q:
                    "The app is not loading. What should I do?",

                a:
                    "Try refreshing the app first. If the problem continues, use Report a Problem and describe exactly what happened."
            },

            {
                q:
                    "My reward did not appear.",

                a:
                    "Check your App Transactions and current balance. If the reward is still missing, report the issue to support."
            },

            {
                q:
                    "My coins are incorrect.",

                a:
                    "Check the Bank and App Transactions sections. If the balances do not match, report the problem with the amount you expected to have."
            },

            {
                q:
                    "Something else is broken.",

                a:
                    "Use Report a Problem and include the page where the problem happened and what you were doing immediately before it occurred."
            }

        ]

    }

};


/* =====================================================
GENERAL FAQ DATA
===================================================== */

const HELP_GENERAL_FAQS = [

    {
        q:
            "How does Secret Crush work?",

        a:
            "Secret Crush allows people to send anonymous crushes and use clues and guessing mechanics to discover who likes them."
    },

    {
        q:
            "How do I reveal a crush?",

        a:
            "When you receive an eligible crush, the available reveal options are presented to you. Depending on the flow, you may use clues, guessing or other available actions."
    },

    {
        q:
            "How does Guess My Crush work?",

        a:
            "Guess My Crush uses questions and clues to help you identify the person behind a Secret Crush."
    },

    {
        q:
            "How do Daily Rewards work?",

        a:
            "Daily Rewards provide available rewards when you return to Secret Crush and claim them."
    },

    {
        q:
            "Where can I see my transactions?",

        a:
            "Go to My Space → Transactions. From there you can switch between Wallet and App Transactions."
    },

    {
        q:
            "How do I delete a Moment?",

        a:
            "Open your post options using the three-dot menu and choose Delete Post."
    }

];


let helpFaqExpanded =
    false;


/* =====================================================
RENDER GENERAL FAQ
===================================================== */

function renderHelpGeneralFaqs(){

    if(!helpFaqList){
        return;
    }


    const visibleFaqs =
        helpFaqExpanded
            ? HELP_GENERAL_FAQS
            : HELP_GENERAL_FAQS.slice(0,6);


    helpFaqList.innerHTML =
        visibleFaqs.map(
            (faq,index) => `

                <article
                    class="help-faq-item"
                    data-faq-index="${index}"
                >

                    <button
                        type="button"
                        class="help-faq-question"
                    >

                        <span>
                            ${faq.q}
                        </span>

                        <span>
                            ⌄
                        </span>

                    </button>


                    <div
                        class="help-faq-answer"
                    >
                        ${faq.a}
                    </div>

                </article>

            `
        ).join("");


    attachHelpFaqEvents();

}


/* =====================================================
FAQ EVENTS
===================================================== */

function attachHelpFaqEvents(){

    document
        .querySelectorAll(
            "#help-faq-list .help-faq-question"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const item =
                        button.closest(
                            ".help-faq-item"
                        );


                    if(!item){
                        return;
                    }


                    item.classList.toggle(
                        "open"
                    );

                }
            );

        });

}


/* =====================================================
OPEN HELP PAGE
===================================================== */

function openHelpSupportPage(){

    document
        .querySelectorAll(".app-page")
        .forEach(page => {

            page.classList.remove(
                "active"
            );

        });


    if(!helpSupportPage){
        return;
    }


    closeSideMenu();


    helpSupportPage.classList.add(
        "active"
    );


    helpSupportPage.scrollTop =
        0;


    setActiveNavigation("");


    hideAppNavigation();


    renderHelpGeneralFaqs();

}


/* =====================================================
BACK TO HOME
===================================================== */

if(helpSupportBackButton){

    helpSupportBackButton.addEventListener(
        "click",
        () => {

            helpSupportPage.classList.remove(
                "active"
            );

            openHomepage();
            openSideMenu();
            

        }
    );

}


/* =====================================================
OPEN TOPIC OVERLAY
===================================================== */

function openHelpTopic(topicKey){

    const topic =
        HELP_TOPICS[topicKey];


    if(
        !topic ||
        !helpTopicOverlay ||
        !helpTopicFaqs
    ){

        return;

    }


    helpTopicTitle.textContent =
        topic.title;


    helpTopicDescription.textContent =
        topic.description;


    helpTopicDialogIcon.textContent =
        topic.icon;


    helpTopicFaqs.innerHTML =
        topic.faqs
            .map(
                (faq,index) => `

                    <article
                        class="help-faq-item"
                        data-topic-faq="${index}"
                    >

                        <button
                            type="button"
                            class="help-faq-question"
                        >

                            <span>
                                ${faq.q}
                            </span>

                            <span>
                                ⌄
                            </span>

                        </button>


                        <div
                            class="help-faq-answer"
                        >
                            ${faq.a}
                        </div>

                    </article>

                `
            )
            .join("");


    helpTopicFaqs
        .querySelectorAll(
            ".help-faq-question"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const item =
                        button.closest(
                            ".help-faq-item"
                        );


                    item?.classList.toggle(
                        "open"
                    );

                }
            );

        });


    helpTopicOverlay.classList.add(
        "active"
    );


    helpTopicOverlay.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "help-overlay-open"
    );

}


/* =====================================================
CLOSE TOPIC OVERLAY
===================================================== */

function closeHelpTopic(){

    if(!helpTopicOverlay){
        return;
    }


    helpTopicOverlay.classList.remove(
        "active"
    );


    helpTopicOverlay.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "help-overlay-open"
    );

}


/* =====================================================
TOPIC BUTTONS
===================================================== */

document
    .querySelectorAll(
        ".help-topic-card"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                openHelpTopic(
                    button.dataset.helpTopic
                );

            }
        );

    });


/* =====================================================
VIEW ALL TOPICS
===================================================== */

const helpViewAllTopics =
    document.getElementById(
        "help-view-all-topics"
    );


if(helpViewAllTopics){

    helpViewAllTopics.addEventListener(
        "click",
        () => {

            openHelpTopic("crush");

        }
    );

}


/* =====================================================
CLOSE TOPIC
===================================================== */

if(helpTopicClose){

    helpTopicClose.addEventListener(
        "click",
        closeHelpTopic
    );

}


if(helpTopicBackdrop){

    helpTopicBackdrop.addEventListener(
        "click",
        closeHelpTopic
    );

}


/* =====================================================
VIEW MORE FAQ
===================================================== */

const helpViewMoreFaq =
    document.getElementById(
        "help-view-more-faq"
    );


if(helpViewMoreFaq){

    helpViewMoreFaq.addEventListener(
        "click",
        () => {

            helpFaqExpanded =
                !helpFaqExpanded;


            helpViewMoreFaq.textContent =
                helpFaqExpanded
                    ? "Show fewer questions⌃"
                    : "View more questions⌄";


            renderHelpGeneralFaqs();

        }
    );

}


/* =====================================================
SEARCH FAQ
===================================================== */

if(helpSupportSearchInput){

    helpSupportSearchInput.addEventListener(
        "input",
        () => {

            const query =
                helpSupportSearchInput
                    .value
                    .trim()
                    .toLowerCase();


            if(!query){

                renderHelpGeneralFaqs();

                return;

            }


            const matches =
                HELP_GENERAL_FAQS.filter(
                    faq => {

                        return (

                            faq.q
                                .toLowerCase()
                                .includes(query)

                            ||

                            faq.a
                                .toLowerCase()
                                .includes(query)

                        );

                    }
                );


            helpFaqList.innerHTML =
                matches.length
                    ? matches.map(
                        faq => `

                            <article
                                class="help-faq-item open"
                            >

                                <button
                                    type="button"
                                    class="help-faq-question"
                                >

                                    <span>
                                        ${faq.q}
                                    </span>

                                    <span>
                                        ⌃
                                    </span>

                                </button>


                                <div
                                    class="help-faq-answer"
                                >
                                    ${faq.a}
                                </div>

                            </article>

                        `
                    ).join("")

                    :

                    `

                        <div
                            style="
                                padding:20px;
                                text-align:center;
                                color:#91899f;
                            "
                        >
                            No matching questions found.
                        </div>

                    `;


            attachHelpFaqEvents();

        }
    );

}


/* =====================================================
SUPPORT ACTION CONTENT
===================================================== */

const HELP_ACTIONS = {

    problem: {

        title:
            "Report a Problem",

        icon:
            "⚠",

        description:
            "Tell us what went wrong so we can investigate it.",

        content: `

            <p>
                Please include:
            </p>

            <ul>

                <li>
                    The page where the problem happened
                </li>

                <li>
                    What you were trying to do
                </li>

                <li>
                    What happened instead
                </li>

                <li>
                    Any error message you saw
                </li>

            </ul>

            <div class="help-action-contact-line">
                📧
                support.asherise@gmail.com
            </div>

            <div class="help-action-contact-line">
                ☎ 0791219011
            </div>

        `

    },


    user: {

        title:
            "Report a User",

        icon:
            "🛡",

        description:
            "Report behaviour that violates the safety of the Secret Crush community.",

        content: `

            <p>
                When reporting someone, provide as much
                information as possible about what happened.
            </p>

            <div class="help-action-contact-line">
                📧support.asherise @gmail.com
            </div>

            <div class="help-action-contact-line">
                ☎ 0791219011
            </div>

            <p>
                Reports should be genuine and submitted
                for safety or policy concerns.
            </p>

        `

    },


    contact: {

        title:
            "Contact Support",

        icon:
            "💬",

        description:
            "Get in touch with the Secret Crush support team.",

        content: `

            <div class="help-action-contact-line">

                <strong>
                    Email
                </strong>

                <br>

                support.asherise@gmail.com

            </div>


            <div class="help-action-contact-line">

                <strong>
                    Phone
                </strong>

                <br>

                0791219011

            </div>


            <div class="help-action-contact-line">

                <strong>
                    Instagram
                </strong>

                <br>

                Asherise_support

            </div>


            <div class="help-action-contact-line">

                <strong>
                    TikTok
                </strong>

                <br>

                Asherise_support

            </div>

        `

    }

};


/* =====================================================
OPEN SUPPORT ACTION
===================================================== */

function openHelpAction(actionKey){

    const action =
        HELP_ACTIONS[actionKey];


    if(
        !action ||
        !helpActionOverlay
    ){

        return;

    }


    helpActionTitle.textContent =
        action.title;


    helpActionDescription.textContent =
        action.description;


    helpActionIconLarge.textContent =
        action.icon;


    helpActionContent.innerHTML =
        action.content;


    helpActionOverlay.classList.add(
        "active"
    );


    helpActionOverlay.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "help-overlay-open"
    );

}


/* =====================================================
CLOSE SUPPORT ACTION
===================================================== */

function closeHelpAction(){

    if(!helpActionOverlay){
        return;
    }


    helpActionOverlay.classList.remove(
        "active"
    );


    helpActionOverlay.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "help-overlay-open"
    );

}


/* =====================================================
SUPPORT ACTION BUTTONS
===================================================== */

document
    .querySelectorAll(
        "[data-help-action]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                openHelpAction(
                    button.dataset.helpAction
                );

            }
        );

    });


/* =====================================================
CLOSE SUPPORT ACTION
===================================================== */

if(helpActionClose){

    helpActionClose.addEventListener(
        "click",
        closeHelpAction
    );

}


if(helpActionBackdrop){

    helpActionBackdrop.addEventListener(
        "click",
        closeHelpAction
    );

}


/* =====================================================
ESCAPE KEY
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if(event.key !== "Escape"){
            return;
        }


        closeHelpTopic();

        closeHelpAction();

    }
);

/* =====================================================
MODULE: CHAT SYSTEM
===================================================== */

const SC_CHATS_KEY =
    "secretCrushChats";

let activeChatCrushId = null;


/* =====================================================
CHAT ELEMENT REFERENCES
===================================================== */

const chatThreadView =
    document.getElementById(
        "chat-thread-view"
    );

const chatThreadBackdrop =
    document.getElementById(
        "chat-thread-backdrop"
    );

const chatThreadBack =
    document.getElementById(
        "chat-thread-back"
    );

const chatThreadPerson =
    document.getElementById(
        "chat-thread-person"
    );

const chatThreadBody =
    document.getElementById(
        "chat-thread-body"
    );

const chatMessageInput =
    document.getElementById(
        "chat-message-input"
    );

const chatSendButton =
    document.getElementById(
        "chat-send-button"
    );

const chatList =
    document.getElementById(
        "chat-list"
    );

const chatSearchInput =
    document.getElementById(
        "chat-search-input"
    );

const chatMoreButton =
    document.getElementById(
        "chat-more-button"
    );

const chatMoreMenu =
    document.getElementById(
        "chat-more-menu"
    );

const chatConfirmOverlay =
    document.getElementById(
        "chat-confirm-overlay"
    );

const chatConfirmTitle =
    document.getElementById(
        "chat-confirm-title"
    );

const chatConfirmMessage =
    document.getElementById(
        "chat-confirm-message"
    );

const chatConfirmCancel =
    document.getElementById(
        "chat-confirm-cancel"
    );

const chatConfirmOk =
    document.getElementById(
        "chat-confirm-ok"
    );
    
    /* =====================================================
CHAT BACKGROUND PICKER
===================================================== */

const SC_CHAT_BACKGROUND_KEY =
    "secretCrushChatBackgrounds";

const chatBackgroundOverlay =
    document.getElementById(
        "sc-chat-background-overlay"
    );

const chatBackgroundBackdrop =
    document.getElementById(
        "sc-chat-background-backdrop"
    );

const chatBackgroundClose =
    document.getElementById(
        "sc-chat-background-close"
    );

const chatBackgroundCancel =
    document.getElementById(
        "sc-chat-background-cancel"
    );

const chatBackgroundApply =
    document.getElementById(
        "sc-chat-background-apply"
    );

const chatBackgroundPreview =
    document.getElementById(
        "sc-chat-background-preview"
    );

const chatBackgroundSystem =
    document.getElementById(
        "sc-chat-background-system"
    );

const chatBackgroundGallery =
    document.getElementById(
        "sc-chat-background-gallery"
    );

const chatBackgroundSystemPanel =
    document.getElementById(
        "sc-chat-background-system-panel"
    );

const chatBackgroundGalleryPanel =
    document.getElementById(
        "sc-chat-background-gallery-panel"
    );

const chatBackgroundThemeGrid =
    document.getElementById(
        "sc-chat-background-theme-grid"
    );

const chatBackgroundGalleryButton =
    document.getElementById(
        "sc-chat-background-gallery-button"
    );

const chatBackgroundFile =
    document.getElementById(
        "sc-chat-background-file"
    );


let selectedChatBackground = {
    type:"theme",
    value:"dark"
};


function getChatBackgroundStore(){

    try{

        return JSON.parse(
            localStorage.getItem(
                SC_CHAT_BACKGROUND_KEY
            )
        ) || {};

    }catch(error){

        return {};

    }

}


function saveChatBackgroundStore(
    store
){

    localStorage.setItem(
        SC_CHAT_BACKGROUND_KEY,
        JSON.stringify(store)
    );

}


function getSavedChatBackground(
    crushId
){

    const store =
        getChatBackgroundStore();

    return store[crushId] || {
        type:"theme",
        value:"dark"
    };

}


function chatBackgroundClassName(
    theme
){

    return `sc-chat-bg-theme-${theme}`;

}


function clearChatBackgroundClasses(
    element
){

    if(!element) return;

    [
        "dark",
        "light",
        "space",
        "stars",
        "aurora"
    ].forEach(
        theme => {

            element.classList.remove(
                chatBackgroundClassName(
                    theme
                )
            );

        }
    );


    element.classList.remove(
        "sc-chat-bg-image"
    );


    element.style.backgroundImage = "";

}


function applyChatBackground(
    background
){

    if(!chatThreadBody){

        return;

    }


    clearChatBackgroundClasses(
        chatThreadBody
    );


    if(
        background?.type === "image"
        &&
        background.value
    ){

        chatThreadBody.classList.add(
            "sc-chat-bg-image"
        );

        chatThreadBody.style.backgroundImage =
            `url("${background.value}")`;

        return;

    }


    const theme =
        [
            "dark",
            "light",
            "space",
            "stars",
            "aurora"
        ].includes(
            background?.value
        )
            ? background.value
            : "dark";


    chatThreadBody.classList.add(
        chatBackgroundClassName(
            theme
        )
    );

}


function saveActiveChatBackground(
    background
){

    if(!activeChatCrushId){

        return;

    }


    const store =
        getChatBackgroundStore();


    store[activeChatCrushId] =
        background;


    saveChatBackgroundStore(
        store
    );

}


function setBackgroundPreview(
    background
){

    if(!chatBackgroundPreview){

        return;

    }


    clearChatBackgroundClasses(
        chatBackgroundPreview
    );


    if(
        background?.type === "image"
        &&
        background.value
    ){

        chatBackgroundPreview.classList.add(
            "sc-chat-bg-image"
        );

        chatBackgroundPreview.style.backgroundImage =
            `url("${background.value}")`;

        return;

    }


    const theme =
        [
            "dark",
            "light",
            "space",
            "stars",
            "aurora"
        ].includes(
            background?.value
        )
            ? background.value
            : "dark";


    chatBackgroundPreview.classList.add(
        chatBackgroundClassName(
            theme
        )
    );

}


function updateBackgroundThemeSelection(
    theme
){

    if(!chatBackgroundThemeGrid){

        return;

    }


    chatBackgroundThemeGrid
        .querySelectorAll(
            "[data-chat-background-theme]"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "selected",
                    button.dataset.chatBackgroundTheme === theme
                );

            }
        );

}


function setChatBackgroundSource(
    source
){

    const system =
        source === "system";


    if(chatBackgroundSystem){

        chatBackgroundSystem.classList.toggle(
            "active",
            system
        );

        chatBackgroundSystem.setAttribute(
            "aria-selected",
            String(system)
        );

    }


    if(chatBackgroundGallery){

        chatBackgroundGallery.classList.toggle(
            "active",
            !system
        );

        chatBackgroundGallery.setAttribute(
            "aria-selected",
            String(!system)
        );

    }


    if(chatBackgroundSystemPanel){

        chatBackgroundSystemPanel.hidden =
            !system;

    }


    if(chatBackgroundGalleryPanel){

        chatBackgroundGalleryPanel.hidden =
            system;

    }

}


function openChatBackgroundPicker(){

    if(!chatBackgroundOverlay){

        return;

    }


    const current =
        getSavedChatBackground(
            activeChatCrushId
        );


    selectedChatBackground = {
        ...current
    };


    setChatBackgroundSource(
        selectedChatBackground.type === "image"
            ? "gallery"
            : "system"
    );


    if(
        selectedChatBackground.type === "theme"
    ){

        updateBackgroundThemeSelection(
            selectedChatBackground.value
        );

    }


    setBackgroundPreview(
        selectedChatBackground
    );


    chatBackgroundOverlay.classList.add(
        "active"
    );


    chatBackgroundOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeChatBackgroundPicker(){

    if(!chatBackgroundOverlay){

        return;

    }


    chatBackgroundOverlay.classList.remove(
        "active"
    );


    chatBackgroundOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

}


async function compressChatBackgroundImage(
    file
){

    const image =
        new Image();


    const objectUrl =
        URL.createObjectURL(
            file
        );


    try{

        await new Promise(
            (resolve,reject) => {

                image.onload = resolve;

                image.onerror = reject;

                image.src = objectUrl;

            }
        );


        const maxWidth = 1080;

        const maxHeight = 1920;


        const ratio =
            Math.min(
                1,
                maxWidth / image.naturalWidth,
                maxHeight / image.naturalHeight
            );


        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            Math.max(
                1,
                Math.round(
                    image.naturalWidth * ratio
                )
            );


        canvas.height =
            Math.max(
                1,
                Math.round(
                    image.naturalHeight * ratio
                )
            );


        const context =
            canvas.getContext(
                "2d"
            );


        context.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height
        );


        return canvas.toDataURL(
            "image/jpeg",
            .82
        );

    }finally{

        URL.revokeObjectURL(
            objectUrl
        );

    }

}


function applySavedChatBackground(){

    if(!activeChatCrushId){

        applyChatBackground({
            type:"theme",
            value:"dark"
        });

        return;

    }


    applyChatBackground(
        getSavedChatBackground(
            activeChatCrushId
        )
    );

}


/* =====================================================
CHAT STORAGE
===================================================== */

/* =====================================================
MODULE: CHAT MEDIA STORAGE
===================================================== */

const SC_CHAT_MEDIA_DB =
    "SecretCrushChatMedia";

const SC_CHAT_MEDIA_STORE =
    "attachments";

let SC_CHAT_MEDIA_DB_INSTANCE =
    null;


function openChatMediaDB(){

    if(SC_CHAT_MEDIA_DB_INSTANCE){

        return Promise.resolve(
            SC_CHAT_MEDIA_DB_INSTANCE
        );

    }


    return new Promise(
        (resolve,reject) => {

            const request =
                indexedDB.open(
                    SC_CHAT_MEDIA_DB,
                    1
                );


            request.onupgradeneeded =
                event => {

                    const db =
                        event.target.result;


                    if(
                        !db.objectStoreNames.contains(
                            SC_CHAT_MEDIA_STORE
                        )
                    ){

                        db.createObjectStore(
                            SC_CHAT_MEDIA_STORE,
                            {
                                keyPath:"id"
                            }
                        );

                    }

                };


            request.onsuccess =
                event => {

                    SC_CHAT_MEDIA_DB_INSTANCE =
                        event.target.result;

                    resolve(
                        SC_CHAT_MEDIA_DB_INSTANCE
                    );

                };


            request.onerror =
                () => {

                    reject(
                        request.error
                    );

                };

        }
    );

}


function saveChatMedia(
    record
){

    return openChatMediaDB()
        .then(
            db =>
                new Promise(
                    (resolve,reject) => {

                        const transaction =
                            db.transaction(
                                SC_CHAT_MEDIA_STORE,
                                "readwrite"
                            );


                        transaction
                            .objectStore(
                                SC_CHAT_MEDIA_STORE
                            )
                            .put(record);


                        transaction.oncomplete =
                            () => resolve();


                        transaction.onerror =
                            () =>
                                reject(
                                    transaction.error
                                );

                    }
                )
        );

}


function getChatMedia(
    id
){

    return openChatMediaDB()
        .then(
            db =>
                new Promise(
                    (resolve,reject) => {

                        const request =
                            db
                                .transaction(
                                    SC_CHAT_MEDIA_STORE,
                                    "readonly"
                                )
                                .objectStore(
                                    SC_CHAT_MEDIA_STORE
                                )
                                .get(id);


                        request.onsuccess =
                            () =>
                                resolve(
                                    request.result ||
                                    null
                                );


                        request.onerror =
                            () =>
                                reject(
                                    request.error
                                );

                    }
                )
        );

}


function deleteChatMedia(
    id
){

    return openChatMediaDB()
        .then(
            db =>
                new Promise(
                    (resolve,reject) => {

                        const transaction =
                            db.transaction(
                                SC_CHAT_MEDIA_STORE,
                                "readwrite"
                            );


                        transaction
                            .objectStore(
                                SC_CHAT_MEDIA_STORE
                            )
                            .delete(id);


                        transaction.oncomplete =
                            () => resolve();


                        transaction.onerror =
                            () =>
                                reject(
                                    transaction.error
                                );

                    }
                )
        );

}



function getChatStore(){

    try{

        return JSON.parse(
            localStorage.getItem(
                SC_CHATS_KEY
            )
        ) || {};

    }catch(error){

        return {};

    }

}


function saveChatStore(store){

    localStorage.setItem(
        SC_CHATS_KEY,
        JSON.stringify(store)
    );

}


function getChatMessages(crushId){

    const store =
        getChatStore();

    return Array.isArray(
        store[crushId]
    )
        ? store[crushId]
        : [];

}


/* =====================================================
CREATE CHAT
===================================================== */

function ensureChatExists(crush){

    if(!crush) return;

    const store =
        getChatStore();

    if(!Array.isArray(
        store[crush.id]
    )){

        store[crush.id] = [];

        saveChatStore(store);

    }

}


/* =====================================================
TIME FORMAT
===================================================== */

function formatChatTime(timestamp){

    const date =
        new Date(timestamp);

    return date.toLocaleTimeString(
        [],
        {
            hour:"numeric",
            minute:"2-digit"
        }
    );

}


/* =====================================================
CHAT LIST
===================================================== */

function renderChatList(){

    if(!chatList) return;

    const query =
        (
            chatSearchInput?.value
            || ""
        )
        .trim()
        .toLowerCase();


    /*
     * Uses the mutual crushes that
     * already exist in Secret Crush.
     */
const mutuals =
        typeof getMutualCrushes === "function"
            ? getMutualCrushes()
                .filter(
                    crush =>
                        crush.mutualChatUnlocked
                        ||
                        getChatMessages(crush.id).length
                )
                .map(SC_Mutual_AsViewer)
            : [];

    const chats =
        mutuals
        .map(crush => {

            ensureChatExists(
                crush
            );

            const messages =
                getChatMessages(
                    crush.id
                );

            const last =
                messages[
                    messages.length - 1
                ];

            return {
                crush,
                messages,
                last
            };

        })
        .filter(item => {

            const name =
                item.crush.name || "";

            const username =
                item.crush.username || "";

            const message =
                item.last?.text || "";

            const searchable =
                `${name}
                 ${username}
                 ${message}`
                .toLowerCase();

            return (
                !query
                ||
                searchable.includes(query)
            );

        })
        .sort((a,b) => {

            const timeA =
                a.last?.time
                || a.crush.mutualChatUnlockedAt
                || 0;

            const timeB =
                b.last?.time
                || b.crush.mutualChatUnlockedAt
                || 0;
                
            return timeB - timeA;

        });


    chatList.innerHTML = "";


    if(!chats.length){

        chatList.innerHTML = `

            <div class="chat-empty-state">

                <div>♡</div>

                <h3>
                    No chats yet
                </h3>

                <p>
                    When a crush becomes mutual,
                    your private conversations
                    will appear here.
                </p>

            </div>

        `;

        return;

    }


    chats.forEach(item => {

        const crush =
            item.crush;

        const last =
            item.last;


        const avatar =
            crush.photo

            ?

            `
            <img
                src="${crush.photo}"
                alt=""
            >
            `

            :

            `
            <span>?</span>
            `;


        const card =
            document.createElement(
                "button"
            );

        card.type =
            "button";

        card.className =
            "chat-list-item";


        card.innerHTML = `

            <div
                class="chat-list-avatar"
            >

                ${avatar}

                <span
                    class="chat-online-dot"
                ></span>

            </div>


            <div
                class="chat-list-copy"
            >

                <div
                    class="chat-list-top"
                >

                    <strong>
                        ${escapePostHTML(
                            crush.name || "Secret Crush"
                        )}
                    </strong>

                    <small>
                        ${
                            last
                            ? formatChatTime(
                                last.time
                            )
                            : ""
                        }
                    </small>

                </div>


                <p>
                    ${
                        last
                        ? escapePostHTML(
                            last.text
                        )
                        : "Start your conversation 💜"
                    }
                </p>

            </div>


            <span
                class="chat-list-arrow"
            >
                ›
            </span>

        `;


        card.addEventListener(
            "click",
            () => {

                openChatThread(
                    crush
                );

            }
        );


        chatList.appendChild(
            card
        );

    });

}


/* =====================================================
OPEN CHAT
===================================================== */

function openChatThread(crush){

    if(
        !crush
        ||
        !chatThreadView
    ) return;


    activeChatCrushId =
        crush.id;
        
        applySavedChatBackground();


    ensureChatExists(
        crush
    );
    
        normalizeCurrentChatMessages();

    markIncomingChatMessagesAsRead();
    


    if(chatsPage){

        chatsPage.classList.remove(
            "active"
        );

    }


    if(
        typeof mutualCrushView !==
        "undefined"
        &&
        mutualCrushView
    ){

        mutualCrushView.classList.remove(
            "active"
        );

    }


    const avatar =
        crush.photo

        ?

        `
        <img
            src="${crush.photo}"
            alt=""
        >
        `

        :

        `
        <span>?</span>
        `;


    chatThreadPerson.innerHTML = `

        <div
            class="chat-thread-avatar"
        >

            ${avatar}

            <span></span>

        </div>


        <div>

            <strong>
                ${escapePostHTML(
                    crush.name ||
                    "Secret Crush"
                )}
            </strong>

            <small>
                💜 Mutual Crush • Online
            </small>

        </div>

    `;


    renderChatMessages();


    chatThreadView.classList.add(
        "active"
    );

    chatThreadView.setAttribute(
        "aria-hidden",
        "false"
    );



}


/* =====================================================
CLOSE CHAT
===================================================== */

function closeChatThread(){

    if(!chatThreadView)
        return;


    chatThreadView.classList.remove(
        "active"
    );

    chatThreadView.setAttribute(
        "aria-hidden",
        "true"
    );


    closeChatMoreMenu();


    activeChatCrushId =
        null;


    if(chatsPage){

        chatsPage.classList.add(
            "active"
        );

        chatsPage.scrollTop =
            0;

    }


    renderChatList();

}


/* =====================================================
RENDER MESSAGES
===================================================== */
async function renderChatMessages(){

    if(
        !chatThreadBody
        ||
        !activeChatCrushId
    ){

        return;

    }


    const messages =
        getChatMessages(
            activeChatCrushId
        );


    chatThreadBody.innerHTML = `

        <div
            class="chat-match-banner"
        >

            <span>♡</span>

            <strong>
                It's a match!
            </strong>

            <small>
                Be smooth and don't blow it.
            </small>

        </div>


        <div
            class="chat-day-divider"
        >

            <span>
                Today
            </span>

        </div>


        ${
            messages
            .map(
                message => {

                    const mine =
                        message.from === "me";


                    const reactions =
                        message.reactions &&
                        typeof message.reactions === "object"
                            ? message.reactions
                            : {};


                    const reactionEntries =
                        Object.entries(
                            reactions
                        );


                    const attachments =
                        Array.isArray(
                            message.attachments
                        )
                            ? message.attachments
                            : [];


                    return `

                        <div
                            class="
                                chat-message-row
                                ${
                                    mine
                                    ? "mine"
                                    : "theirs"
                                }
                            "
                            data-message-id="${
                                message.id
                            }"
                        >

                            ${
                                !mine

                                ?

                                `
                                <div
                                    class="
                                        chat-message-avatar
                                    "
                                >
                                    ?
                                </div>
                                `

                                :

                                ""
                            }


                            <div
                                class="chat-message-content"
                            >

                                ${
                                    textMessageHTML(
                                        message
                                    )
                                }


                                ${
                                    attachments.length
                                    ?

                                    `
                                    <div
                                        class="
                                            chat-media-message
                                            chat-media-grid
                                            ${
                                                attachments.length === 1
                                                    ? "one"
                                                    : attachments.length === 2
                                                        ? "two"
                                                        : attachments.length === 3
                                                            ? "three"
                                                            : "four"
                                            }
                                        "
                                        data-media-message-id="${
                                            message.id
                                        }"
                                    >

                                        ${

                                            attachments
                                                .map(
                                                    (
                                                        attachment,
                                                        index
                                                    ) => `

                                                        <button
                                                            type="button"
                                                            class="
                                                                chat-media-grid-item
                                                            "
                                                            data-media-message-id="${
                                                                message.id
                                                            }"
                                                            data-media-index="${
                                                                index
                                                            }"
                                                        >

                                                            <span
                                                                class="chat-media-loading"
                                                            >
                                                                •••
                                                            </span>

                                                        </button>

                                                    `
                                                )
                                                .join("")

                                        }

                                    </div>

                                    `

                                    :

                                    ""
                                }


                                ${
                                    attachments.length
                                    ?

                                    `
                                    <div
                                        class="chat-message-file-time"
                                    >
                                        ${formatChatTime(
                                            message.time
                                        )}

                                        ${
                                            mine

                                            ?

                                            `
                                            <span
                                                class="
                                                    chat-read-indicator
                                                    ${
                                                        message.read
                                                        ? "read"
                                                        : ""
                                                    }
                                                "
                                            >
                                                ${
                                                    message.read
                                                    ? "✓✓"
                                                    : "✓"
                                                }
                                            </span>
                                            `

                                            :

                                            ""
                                        }

                                    </div>
                                    `

                                    :

                                    ""
                                }


                                ${
                                    reactionEntries.length

                                    ?

                                    `
                                    <div
                                        class="
                                            chat-message-reactions
                                        "
                                    >

                                        ${
                                            reactionEntries
                                                .map(
                                                    ([user,emoji]) => `

                                                        <button
                                                            type="button"
                                                            class="
                                                                chat-reaction-pill
                                                                ${
                                                                    user === "me"
                                                                    ? "mine-reaction"
                                                                    : ""
                                                                }
                                                            "
                                                            data-reaction="${
                                                                escapePostHTML(
                                                                    emoji
                                                                )
                                                            }"
                                                            data-message-id="${
                                                                message.id
                                                            }"
                                                        >
                                                            ${emoji}
                                                        </button>

                                                    `
                                                )
                                                .join("")
                                        }

                                    </div>

                                    `

                                    :

                                    ""
                                }

                            </div>

                        </div>

                    `;

                }
            )
            .join("")
        }

    `;


    await hydrateChatMediaMessages();


    chatThreadBody.scrollTop =
        chatThreadBody.scrollHeight;

}


function textMessageHTML(
    message
){

    if(
        !message.text
    ){

        return "";

    }


    const mine =
        message.from === "me";


    return `

        <div
            class="chat-bubble"
        >

            <p>

                ${escapePostHTML(
                    message.text
                )}

                ${
                    message.edited

                    ?

                    `
                    <span
                        class="
                            chat-edited-label
                        "
                    >
                        edited
                    </span>
                    `

                    :

                    ""
                }

            </p>


            <small>

                ${formatChatTime(
                    message.time
                )}

                ${
                    mine

                    ?

                    `
                    <span
                        class="
                            chat-read-indicator
                            ${
                                message.read
                                ? "read"
                                : ""
                            }
                        "
                    >
                        ${
                            message.read
                            ? "✓✓"
                            : "✓"
                        }
                    </span>
                    `

                    :

                    ""
                }

            </small>

        </div>

    `;

}


async function hydrateChatMediaMessages(){

    const mediaMessages =
        chatThreadBody.querySelectorAll(
            "[data-media-message-id]"
        );


    for(
        const container
        of mediaMessages
    ){

        if(
            !container.classList.contains(
                "chat-media-grid"
            )
        ){

            continue;

        }


        const messageId =
            container.dataset.mediaMessageId;


        const message =
            getChatMessages(
                activeChatCrushId
            ).find(
                item =>
                    String(item.id) ===
                    String(messageId)
            );


        if(
            !message
            ||
            !Array.isArray(
                message.attachments
            )
        ){

            continue;

        }


        const items =
            container.querySelectorAll(
                ".chat-media-grid-item"
            );


        for(
            let index = 0;
            index < items.length;
            index++
        ){

            const button =
                items[index];


            const attachment =
                message.attachments[index];


            if(!attachment){

                continue;

            }


            const record =
                await getChatMedia(
                    attachment.id
                );


            if(!record){

                continue;

            }


            const objectUrl =
                URL.createObjectURL(
                    record.blob
                );


            button.innerHTML = "";


            if(
                record.type === "video"
            ){

                button.innerHTML = `

                    <video
                        src="${objectUrl}"
                        muted
                        playsinline
                        preload="metadata"
                    ></video>

                    <span
                        class="
                            chat-media-preview-video-icon
                        "
                    >
                        ▶
                    </span>

                `;

            }

            else{

                button.innerHTML = `

                    <img
                        src="${objectUrl}"
                        alt=""
                    >

                `;

            }


            button.dataset.objectUrl =
                objectUrl;


            if(
                index ===
                message.attachments.length - 1
                &&
                message.attachments.length > 4
            ){

                const remaining =
                    message.attachments.length -
                    4;


                const overlay =
                    document.createElement(
                        "span"
                    );


                overlay.className =
                    "chat-media-grid-more";


                overlay.textContent =
                    `+${remaining}`;


                button.appendChild(
                    overlay
                );

            }

        }

    }

}


/* =====================================================
CHAT MEDIA VIEWER
===================================================== */

const chatMediaViewer =
    document.getElementById(
        "sc-chat-media-viewer"
    );

const chatMediaViewerStage =
    document.getElementById(
        "sc-chat-media-viewer-stage"
    );

const chatMediaViewerCounter =
    document.getElementById(
        "sc-chat-media-viewer-counter"
    );

const chatMediaViewerClose =
    document.getElementById(
        "sc-chat-media-viewer-close"
    );

const chatMediaViewerPrevious =
    document.getElementById(
        "sc-chat-media-viewer-previous"
    );

const chatMediaViewerNext =
    document.getElementById(
        "sc-chat-media-viewer-next"
    );

const chatMediaViewerSave =
    document.getElementById(
        "sc-chat-media-viewer-save"
    );


let activeChatMediaViewer = {

    messageId:null,

    index:0,

    records:[]

};


async function openChatMediaViewer(
    messageId,
    index
){

    const message =
        getChatMessages(
            activeChatCrushId
        ).find(
            item =>
                String(item.id) ===
                String(messageId)
        );


    if(
        !message
        ||
        !Array.isArray(
            message.attachments
        )
        ||
        !message.attachments.length
    ){

        return;

    }


    const records =
        [];


    for(
        const attachment
        of message.attachments
    ){

        const record =
            await getChatMedia(
                attachment.id
            );


        if(record){

            records.push(
                record
            );

        }

    }


    if(!records.length){

        return;

    }


    activeChatMediaViewer = {

        messageId,

        index:
            Math.max(
                0,
                Math.min(
                    index,
                    records.length - 1
                )
            ),

        records

    };


    renderChatMediaViewer();


    chatMediaViewer.classList.add(
        "active"
    );


    chatMediaViewer.setAttribute(
        "aria-hidden",
        "false"
    );

}


function renderChatMediaViewer(){

    if(
        !chatMediaViewerStage
    ){

        return;

    }


    const record =
        activeChatMediaViewer
            .records[
                activeChatMediaViewer.index
            ];


    if(!record){

        return;

    }


    chatMediaViewerStage.innerHTML =
        "";


    const objectUrl =
        URL.createObjectURL(
            record.blob
        );


    if(
        record.type === "video"
    ){

        const video =
            document.createElement(
                "video"
            );


        video.src =
            objectUrl;

        video.controls =
            true;

        video.autoplay =
            true;

        video.playsInline =
            true;


        chatMediaViewerStage.appendChild(
            video
        );

    }

    else{

        const image =
            document.createElement(
                "img"
            );


        image.src =
            objectUrl;


        chatMediaViewerStage.appendChild(
            image
        );

    }


    chatMediaViewerStage.dataset.objectUrl =
        objectUrl;


    chatMediaViewerCounter.textContent =
        `${
            activeChatMediaViewer.index + 1
        } of ${
            activeChatMediaViewer.records.length
        }`;


    chatMediaViewerPrevious.style.display =
        activeChatMediaViewer.records.length > 1
            ? ""
            : "none";


    chatMediaViewerNext.style.display =
        activeChatMediaViewer.records.length > 1
            ? ""
            : "none";

}


function closeChatMediaViewer(){

    if(
        chatMediaViewerStage
        &&
        chatMediaViewerStage.dataset.objectUrl
    ){

        URL.revokeObjectURL(
            chatMediaViewerStage.dataset.objectUrl
        );

        chatMediaViewerStage.dataset.objectUrl =
            "";

    }


    if(chatMediaViewerStage){

        chatMediaViewerStage.innerHTML =
            "";

    }


    chatMediaViewer.classList.remove(
        "active"
    );


    chatMediaViewer.setAttribute(
        "aria-hidden",
        "true"
    );

}


if(chatThreadBody){

    chatThreadBody.addEventListener(
        "click",
        event => {

            const media =
                event.target.closest(
                    ".chat-media-grid-item"
                );


            if(!media){

                return;

            }


            openChatMediaViewer(

                media.dataset.mediaMessageId,

                Number(
                    media.dataset.mediaIndex
                )

            );

        }
    );

}


if(chatMediaViewerClose){

    chatMediaViewerClose.addEventListener(
        "click",
        closeChatMediaViewer
    );

}


if(chatMediaViewerPrevious){

    chatMediaViewerPrevious.addEventListener(
        "click",
        () => {

            const total =
                activeChatMediaViewer.records.length;


            if(total <= 1){

                return;

            }


            activeChatMediaViewer.index =
                (
                    activeChatMediaViewer.index -
                    1 +
                    total
                ) % total;


            renderChatMediaViewer();

        }
    );

}


if(chatMediaViewerNext){

    chatMediaViewerNext.addEventListener(
        "click",
        () => {

            const total =
                activeChatMediaViewer.records.length;


            if(total <= 1){

                return;

            }


            activeChatMediaViewer.index =
                (
                    activeChatMediaViewer.index +
                    1
                ) % total;


            renderChatMediaViewer();

        }
    );

}

/* =====================================================
SAVE CHAT MEDIA TO DEVICE
===================================================== */

async function saveChatMediaToDevice(
    record
){

    if(!record){

        return;

    }


    const url =
        URL.createObjectURL(
            record.blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        record.name ||
        `secret-crush-media-${Date.now()}`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    setTimeout(
        () => {

            URL.revokeObjectURL(
                url
            );

        },
        1000
    );

}


if(chatMediaViewerSave){

    chatMediaViewerSave.addEventListener(
        "click",
        async () => {

            const record =
                activeChatMediaViewer
                    .records[
                        activeChatMediaViewer.index
                    ];


            await saveChatMediaToDevice(
                record
            );

        }
    );

}


/* =====================================================
REACTION PILL CLICK
===================================================== */

if(chatThreadBody){

    chatThreadBody.addEventListener(
        "click",
        event => {

            const reaction =
                event.target.closest(
                    ".chat-reaction-pill.mine-reaction"
                );


            if(!reaction){

                return;

            }


            removeChatMessageReaction(
                reaction.dataset.messageId
            );

        }
    );

}

/* =====================================================
CHAT MESSAGE STATE HELPERS
===================================================== */


/*
 * Make sure every message has the fields required
 * by the newer chat system.
 */

function normalizeChatMessage(
    message
){

    if(!message){

        return message;

    }


    if(
        typeof message.read !==
        "boolean"
    ){

        message.read =
            false;

    }


    if(
        typeof message.edited !==
        "boolean"
    ){

        message.edited =
            false;

    }


    if(
        !message.reactions
        ||
        typeof message.reactions !==
        "object"
        ||
        Array.isArray(
            message.reactions
        )
    ){

        message.reactions = {};

    }


    return message;

}


/*
 * Normalize all messages in the
 * currently opened conversation.
 */

function normalizeCurrentChatMessages(){

    if(!activeChatCrushId){

        return [];

    }


    const store =
        getChatStore();


    if(
        !Array.isArray(
            store[
                activeChatCrushId
            ]
        )
    ){

        store[
            activeChatCrushId
        ] = [];

    }


    const messages =
        store[
            activeChatCrushId
        ];


    messages.forEach(
        normalizeChatMessage
    );


    saveChatStore(
        store
    );


    return messages;

}


/*
 * When the recipient opens the chat,
 * incoming messages become read.
 *
 * We deliberately do NOT mark our own
 * messages as read here.
 */

function markIncomingChatMessagesAsRead(){

    if(!activeChatCrushId){

        return;

    }


    const store =
        getChatStore();


    const messages =
        Array.isArray(
            store[
                activeChatCrushId
            ]
        )

        ?

        store[
            activeChatCrushId
        ]

        :

        [];


    let changed =
        false;


    messages.forEach(
        message => {

            normalizeChatMessage(
                message
            );


            if(
                message.from !== "me"
                &&
                !message.read
            ){

                message.read =
                    true;

                changed =
                    true;

            }

        }
    );


    if(changed){

        saveChatStore(
            store
        );

    }

}


/*
 * Display the Asherise warning used when
 * a read message can no longer be changed.
 */

function showChatMessageReadError(
    action
){

    showChatConfirmation(

        "Message already read",

        `This message has already been read, so it cannot be ${
            action === "edit"
                ? "edited"
                : "unsent"
        }. You can still copy the message.`,

        null

    );

}


/*
 * Add or change the current user's reaction.
 */

function setChatMessageReaction(
    messageId,
    reaction
){

    if(
        !activeChatCrushId
        ||
        !messageId
    ){

        return;

    }


    const store =
        getChatStore();


    const messages =
        Array.isArray(
            store[
                activeChatCrushId
            ]
        )

        ?

        store[
            activeChatCrushId
        ]

        :

        [];


    const message =
        messages.find(
            item =>
                String(item.id) ===
                String(messageId)
        );


    if(!message){

        return;

    }


    normalizeChatMessage(
        message
    );


    /*
     * Tapping the same reaction removes it.
     */

    if(
        message.reactions.me ===
        reaction
    ){

        delete message.reactions.me;

    }

    else{

        message.reactions.me =
            reaction;

    }


    saveChatStore(
        store
    );


    closeChatReactionPicker();

    renderChatMessages();

}


/*
 * Remove the current user's reaction.
 */

function removeChatMessageReaction(
    messageId
){

    if(
        !activeChatCrushId
        ||
        !messageId
    ){

        return;

    }


    const store =
        getChatStore();


    const messages =
        Array.isArray(
            store[
                activeChatCrushId
            ]
        )

        ?

        store[
            activeChatCrushId
        ]

        :

        [];


    const message =
        messages.find(
            item =>
                String(item.id) ===
                String(messageId)
        );


    if(!message){

        return;

    }


    normalizeChatMessage(
        message
    );


    delete message.reactions.me;


    saveChatStore(
        store
    );


    renderChatMessages();

}


/*
 * Create the reaction picker.
 */

let chatReactionPicker =
    null;


function createChatReactionPicker(){

    if(chatReactionPicker){

        return chatReactionPicker;

    }


    chatReactionPicker =
        document.createElement(
            "div"
        );


    chatReactionPicker.className =
        "chat-reaction-picker";


    chatReactionPicker.innerHTML = `

        <div
            class="chat-reaction-picker-emojis"
        >

            ${
                [
                    "❤️",
                    "😂",
                    "😍",
                    "😮",
                    "😢",
                    "😡",
                    "👍",
                    "👎",
                    "👏",
                    "🙏",
                    "🔥",
                    "🥰",
                    "😭",
                    "🤣",
                    "😎",
                    "🎉",
                    "💯",
                    "🤍"
                ]
                .map(
                    emoji => `
                        <button
                            type="button"
                            data-reaction-choice="${emoji}"
                            aria-label="React ${emoji}"
                        >
                            ${emoji}
                        </button>
                    `
                )
                .join("")
            }

        </div>


        <button
            type="button"
            class="chat-reaction-remove"
            data-remove-reaction
        >
            Remove reaction
        </button>

    `;


    document.body.appendChild(
        chatReactionPicker
    );


    chatReactionPicker.addEventListener(
        "click",
        event => {

            const reactionButton =
                event.target.closest(
                    "[data-reaction-choice]"
                );


            if(reactionButton){

                const messageId =
                    chatReactionPicker.dataset.messageId;


                setChatMessageReaction(
                    messageId,
                    reactionButton.dataset.reactionChoice
                );


                return;

            }


            const removeButton =
                event.target.closest(
                    "[data-remove-reaction]"
                );


            if(removeButton){

                const messageId =
                    chatReactionPicker.dataset.messageId;


                removeChatMessageReaction(
                    messageId
                );


                closeChatReactionPicker();

            }

        }
    );


    return chatReactionPicker;

}


/*
 * Close reaction picker.
 */

function closeChatReactionPicker(){

    if(
        chatReactionPicker
    ){

        chatReactionPicker.classList.remove(
            "active"
        );

    }

}


/*
 * Position reaction picker near the
 * long-pressed message.
 */

function positionChatReactionPicker(
    row,
    clientX,
    clientY
){

    const picker =
        createChatReactionPicker();


    picker.dataset.messageId =
        row.dataset.messageId;


    const pickerWidth =
        Math.min(
            330,
            window.innerWidth - 24
        );


    const safeX =
        Math.max(
            12,
            Math.min(
                clientX - (
                    pickerWidth / 2
                ),
                window.innerWidth -
                pickerWidth -
                12
            )
        );


    const safeY =
        Math.max(
            12,
            Math.min(
                clientY - 75,
                window.innerHeight -
                150
            )
        );


    picker.style.width =
        pickerWidth + "px";


    picker.style.left =
        safeX + "px";


    picker.style.top =
        safeY + "px";


    picker.classList.add(
        "active"
    );

}


/* =====================================================
MODULE: CHAT MESSAGE LONG-PRESS ACTIONS
===================================================== */

const SC_DELETED_FOR_ME_KEY =
    "secretCrushDeletedForMe";

let chatMessageActionMenu =
    null;

let chatLongPressTimer =
    null;

let chatEditingMessageId =
    null;


/* =====================================================
DELETED-FOR-ME STORAGE
===================================================== */

function getDeletedForMeStore(){

    try{

        return JSON.parse(
            localStorage.getItem(
                SC_DELETED_FOR_ME_KEY
            )
        ) || {};

    }catch(error){

        return {};

    }

}


function saveDeletedForMeStore(
    store
){

    localStorage.setItem(
        SC_DELETED_FOR_ME_KEY,
        JSON.stringify(store)
    );

}


function getDeletedForMeMessages(
    crushId
){

    const store =
        getDeletedForMeStore();

    return Array.isArray(
        store[crushId]
    )
        ? store[crushId]
        : [];

}


function deleteMessageForMe(
    crushId,
    messageId
){

    const store =
        getDeletedForMeStore();

    if(
        !Array.isArray(
            store[crushId]
        )
    ){

        store[crushId] = [];

    }

    if(
        !store[crushId].includes(
            messageId
        )
    ){

        store[crushId].push(
            messageId
        );

    }

    saveDeletedForMeStore(
        store
    );

}

/* =====================================================
CREATE MESSAGE ACTION MENU
===================================================== */

function createChatMessageActionMenu(){

    if(chatMessageActionMenu){

        return chatMessageActionMenu;

    }


    chatMessageActionMenu =
        document.createElement(
            "div"
        );


    chatMessageActionMenu.className =
        "chat-message-action-menu";


    chatMessageActionMenu.innerHTML = `

<button
    type="button"
    data-message-action="view"
>
    View
</button>


<button
    type="button"
    data-message-action="save"
>
    Save
</button>


<button
    type="button"
    data-message-action="forward"
>
    Forward
</button>


<button
    type="button"
    data-message-action="unsend"
>
    Unsend
</button>


<button
    type="button"
    data-message-action="edit"
>
    Edit
</button>


<button
    type="button"
    data-message-action="copy"
>
    Copy
</button>


<button
    type="button"
    class="danger"
    data-message-action="delete"
>
    Delete for me
</button>

    `;


    document.body.appendChild(
        chatMessageActionMenu
    );


    chatMessageActionMenu.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-message-action]"
                );


            if(!button){

                return;

            }


            performChatMessageAction(

                button.dataset.messageAction,

                chatMessageActionMenu.dataset.messageId

            );

        }
    );


    return chatMessageActionMenu;

}


/* =====================================================
CLOSE ACTION MENU
===================================================== */

function closeChatMessageActionMenu(){

    if(
        chatMessageActionMenu
    ){

        chatMessageActionMenu.classList.remove(
            "active"
        );

    }

}


/* =====================================================
POSITION ACTION MENU
===================================================== */

function positionChatMessageActionMenu(
    row,
    clientX,
    clientY
){

    const menu =
        createChatMessageActionMenu();
        
        const message =
    getChatMessages(
        activeChatCrushId
    ).find(
        item =>
            String(item.id) ===
            String(
                row.dataset.messageId
            )
    );


const hasAttachments =
    Array.isArray(
        message?.attachments
    )
    &&
    message.attachments.length > 0;


menu
    .querySelectorAll(
        "[data-media-action]"
    )
    .forEach(
        button => {

            button.style.display =
                hasAttachments
                    ? ""
                    : "none";

        }
    );


    menu.dataset.messageId =
        row.dataset.messageId;


    const menuWidth =
        230;


    const menuHeight =
    310;


    const safeX =
        Math.max(
            12,
            Math.min(
                clientX - 90,
                window.innerWidth -
                menuWidth -
                12
            )
        );


    const safeY =
        Math.max(
            12,
            Math.min(
                clientY - 90,
                window.innerHeight -
                menuHeight -
                12
            )
        );


    menu.style.left =
        safeX + "px";


    menu.style.top =
        safeY + "px";


    menu.classList.add(
        "active"
    );

}


/* =====================================================
OPEN ACTION MENU
===================================================== */

function openChatMessageActions(
    row,
    clientX,
    clientY
){

    if(
        !row
        ||
        !row.classList.contains(
            "mine"
        )
    ){

        return;

    }


    closeChatReactionPicker();

    closeChatMoreMenu();


    positionChatMessageActionMenu(
        row,
        clientX,
        clientY
    );

}


/* =====================================================
OPEN REACTION PICKER
===================================================== */

function openChatReactionActions(
    row,
    clientX,
    clientY
){

    if(
        !row
        ||
        !row.classList.contains(
            "theirs"
        )
    ){

        return;

    }


    closeChatMessageActionMenu();

    closeChatMoreMenu();


    positionChatReactionPicker(
        row,
        clientX,
        clientY
    );

}


/* =====================================================
PERFORM MESSAGE ACTION
===================================================== */

function performChatMessageAction(
    action,
    messageId
){

    if(
        !activeChatCrushId
        ||
        !messageId
    ){

        return;

    }


    const store =
        getChatStore();


    const messages =
        Array.isArray(
            store[
                activeChatCrushId
            ]
        )

        ?

        store[
            activeChatCrushId
        ]

        :

        [];


    const message =
        messages.find(
            item =>
                String(item.id) ===
                String(messageId)
        );


    if(!message){

        closeChatMessageActionMenu();

        return;

    }


    normalizeChatMessage(
        message
    );
    
        const hasAttachments =
        Array.isArray(
            message.attachments
        )
        &&
        message.attachments.length > 0;


    if(
        hasAttachments
        &&
        action === "view"
    ){

        closeChatMessageActionMenu();


        openChatMediaViewer(
            message.id,
            0
        );


        return;

    }


    if(
        hasAttachments
        &&
        action === "save"
    ){

        closeChatMessageActionMenu();


        getChatMedia(
            message.attachments[0].id
        )
        .then(
            record =>
                saveChatMediaToDevice(
                    record
                )
        );


        return;

    }


    if(
        hasAttachments
        &&
        action === "forward"
    ){

        /*
         * Forwarding remains a placeholder until
         * the chat backend/user-selection system
         * exists.
         *
         * The action is intentionally kept here
         * so the media menu already has the
         * correct structure.
         */

        closeChatMessageActionMenu();

        return;

    }


    if(
        hasAttachments
        &&
        action === "copy"
    ){

        closeChatMessageActionMenu();

        return;

    }


    if(
        hasAttachments
        &&
        action === "edit"
    ){

        closeChatMessageActionMenu();

        return;

    }


    /* =================================================
    COPY
    ================================================= */

    if(
        action === "copy"
    ){

        const text =
            message.text || "";


        if(
            navigator.clipboard
            &&
            navigator.clipboard.writeText
        ){

            navigator.clipboard
                .writeText(
                    text
                )
                .catch(
                    () => {}
                );

        }

        else{

            const temporaryInput =
                document.createElement(
                    "textarea"
                );


            temporaryInput.value =
                text;


            document.body.appendChild(
                temporaryInput
            );


            temporaryInput.select();


            document.execCommand(
                "copy"
            );


            temporaryInput.remove();

        }


        closeChatMessageActionMenu();

        return;

    }


    /* =================================================
    UNSEND
    ================================================= */

    if(
        action === "unsend"
    ){

        closeChatMessageActionMenu();


        if(message.read){

            showChatMessageReadError(
                "unsent"
            );

            return;

        }


        showChatConfirmation(

            "Unsend message?",

            "This message will be removed from the conversation.",

            () => {

                /*
                 * Re-check read status at the
                 * exact moment of confirmation.
                 */

                const freshStore =
                    getChatStore();


                const freshMessages =
                    Array.isArray(
                        freshStore[
                            activeChatCrushId
                        ]
                    )

                    ?

                    freshStore[
                        activeChatCrushId
                    ]

                    :

                    [];


                const freshMessage =
                    freshMessages.find(
                        item =>
                            String(item.id) ===
                            String(messageId)
                    );


                if(
                    !freshMessage
                ){

                    return;

                }


                normalizeChatMessage(
                    freshMessage
                );


                if(
                    freshMessage.read
                ){

                    showChatMessageReadError(
                        "unsent"
                    );

                    return;

                }


                freshStore[
                    activeChatCrushId
                ] =
                    freshMessages.filter(
                        item =>
                            String(item.id) !==
                            String(messageId)
                    );


                saveChatStore(
                    freshStore
                );


                renderChatMessages();

                renderChatList();

            }

        );


        return;

    }


    /* =================================================
    DELETE FOR ME
    ================================================= */

    if(
        action === "delete"
    ){

        deleteMessageForMe(
            activeChatCrushId,
            messageId
        );


        closeChatMessageActionMenu();


        renderChatMessages();

        renderChatList();


        return;

    }


    /* =================================================
    EDIT
    ================================================= */

    if(
        action === "edit"
    ){

        closeChatMessageActionMenu();


        if(message.read){

            showChatMessageReadError(
                "edited"
            );

            return;

        }


        chatEditingMessageId =
            messageId;


        if(chatMessageInput){

            chatMessageInput.value =
                message.text || "";


            chatMessageInput.placeholder =
                "Edit message...";


            chatMessageInput.classList.add(
                "editing"
            );


            chatMessageInput.style.height =
                "38px";


            chatMessageInput.style.height =
                Math.min(
                    chatMessageInput.scrollHeight,
                    120
                ) + "px";


            chatMessageInput.focus();


            const length =
                chatMessageInput.value.length;


            chatMessageInput.setSelectionRange(
                length,
                length
            );

        }


        return;

    }

}

/* =====================================================
LONG PRESS / RIGHT CLICK
===================================================== */

if(chatThreadBody){

    /*
     * Desktop / mouse support.
     *
     * Own message = message actions.
     * Other person's message = reactions.
     */

    chatThreadBody.addEventListener(
        "contextmenu",
        event => {

            const row =
                event.target.closest(
                    ".chat-message-row"
                );


            if(!row){

                return;

            }


            event.preventDefault();


            if(
                row.classList.contains(
                    "mine"
                )
            ){

                openChatMessageActions(
                    row,
                    event.clientX,
                    event.clientY
                );

            }

            else{

                openChatReactionActions(
                    row,
                    event.clientX,
                    event.clientY
                );

            }

        }
    );


    /*
     * Mobile long press.
     */

    chatThreadBody.addEventListener(
        "touchstart",
        event => {

            const row =
                event.target.closest(
                    ".chat-message-row"
                );


            if(!row){

                return;

            }


            clearTimeout(
                chatLongPressTimer
            );


            closeChatMessageActionMenu();

            closeChatReactionPicker();


            const touch =
                event.touches[0];


            chatLongPressTimer =
                setTimeout(
                    () => {

                        if(
                            row.classList.contains(
                                "mine"
                            )
                        ){

                            openChatMessageActions(
                                row,
                                touch.clientX,
                                touch.clientY
                            );

                        }

                        else{

                            openChatReactionActions(
                                row,
                                touch.clientX,
                                touch.clientY
                            );

                        }

                    },
                    550
                );

        },
        {
            passive:true
        }
    );


    chatThreadBody.addEventListener(
        "touchmove",
        () => {

            clearTimeout(
                chatLongPressTimer
            );

        },
        {
            passive:true
        }
    );


    chatThreadBody.addEventListener(
        "touchend",
        () => {

            clearTimeout(
                chatLongPressTimer
            );

        },
        {
            passive:true
        }
    );

}


/* =====================================================
CLOSE MENUS WHEN TAPPING ELSEWHERE
===================================================== */

document.addEventListener(
    "click",
    event => {

        if(
            chatMessageActionMenu
            &&
            chatMessageActionMenu.classList.contains(
                "active"
            )
            &&
            !chatMessageActionMenu.contains(
                event.target
            )
        ){

            closeChatMessageActionMenu();

        }


        if(
            chatReactionPicker
            &&
            chatReactionPicker.classList.contains(
                "active"
            )
            &&
            !chatReactionPicker.contains(
                event.target
            )
            &&
            !event.target.closest(
                ".chat-message-row.theirs"
            )
        ){

            closeChatReactionPicker();

        }

    }
);




/* =====================================================
CLOSE MENU WHEN TAPPING ELSEWHERE
===================================================== */

document.addEventListener(
    "click",
    event => {

        if(
            !chatMessageActionMenu
            ||
            !chatMessageActionMenu.classList.contains(
                "active"
            )
        ){

            return;

        }


        if(
            !chatMessageActionMenu.contains(
                event.target
            )
        ){

            closeChatMessageActionMenu();

        }

    }
);


/* =====================================================
SEND MESSAGE
===================================================== */
async function sendChatMessage(){

    if(!activeChatCrushId){

        return;

    }


    const text =
        chatMessageInput
            ? chatMessageInput.value.trim()
            : "";


    if(
        !text
        &&
        !pendingChatMedia.length
    ){

        return;

    }


    const store =
        getChatStore();


    if(
        !Array.isArray(
            store[
                activeChatCrushId
            ]
        )
    ){

        store[
            activeChatCrushId
        ] = [];

    }


    /* =================================================
    EDIT EXISTING TEXT MESSAGE
    ================================================= */

    if(chatEditingMessageId){

        const message =
            store[
                activeChatCrushId
            ].find(
                item =>
                    String(item.id) ===
                    String(
                        chatEditingMessageId
                    )
            );


        if(!message){

            chatEditingMessageId =
                null;

        }

        else{

            normalizeChatMessage(
                message
            );


            if(message.read){

                showChatMessageReadError(
                    "edited"
                );

                return;

            }


            /*
             * Attachments are not editable.
             * Editing is only allowed for
             * normal text messages.
             */

            if(
                message.attachments
                &&
                message.attachments.length
            ){

                return;

            }


            message.text =
                text;


            message.edited =
                true;


            chatEditingMessageId =
                null;


            saveChatStore(
                store
            );


            if(chatMessageInput){

                chatMessageInput.value =
                    "";

                chatMessageInput.style.height =
                    "38px";

                chatMessageInput.placeholder =
                    "Message...";

                chatMessageInput.classList.remove(
                    "editing"
                );

            }


            renderChatMessages();

            renderChatList();


            return;

        }

    }


    /* =================================================
    SAVE ATTACHMENTS
    ================================================= */

    const attachmentRecords =
        [];


    const attachmentMessageId =
        `message-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2,7)}`;


    if(pendingChatMedia.length){

        for(
            const item
            of pendingChatMedia
        ){

            const attachmentId =
                `media-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2,10)}`;


            await saveChatMedia({

                id:
                    attachmentId,

                blob:
                    item.file,

                mimeType:
                    item.file.type,

                type:
                    item.type,

                name:
                    item.file.name,

                size:
                    item.file.size

            });


            attachmentRecords.push({

                id:
                    attachmentId,

                type:
                    item.type,

                name:
                    item.file.name,

                mimeType:
                    item.file.type,

                size:
                    item.file.size

            });

        }

    }


    /* =================================================
    CREATE MESSAGE
    ================================================= */

    store[
        activeChatCrushId
    ].push({

        id:
            attachmentMessageId,

        from:
            "me",

        text:
            text,

        time:
            Date.now(),

        read:
            false,

        edited:
            false,

        reactions:
            {},

        attachments:
            attachmentRecords

    });


    saveChatStore(
        store
    );


    chatEditingMessageId =
        null;


    if(chatMessageInput){

        chatMessageInput.value =
            "";

        chatMessageInput.style.height =
            "38px";

        chatMessageInput.placeholder =
            "Message...";

        chatMessageInput.classList.remove(
            "editing"
        );

    }


    clearPendingChatMedia();


    renderChatMessages();

    renderChatList();

}





/* =====================================================
AUTO-EXPANDING MESSAGE BOX
===================================================== */

if(chatMessageInput){

    chatMessageInput.addEventListener(
        "input",
        () => {

            chatMessageInput.style.height =
                "38px";

            chatMessageInput.style.height =
                Math.min(
                    chatMessageInput.scrollHeight,
                    120
                ) + "px";

        }
    );


    chatMessageInput.addEventListener(
        "keydown",
        event => {

            if(
                event.key === "Enter"
                &&
                !event.shiftKey
            ){

                event.preventDefault();

                sendChatMessage();

            }

        }
    );

}


/* =====================================================
CHAT BUTTON EVENTS
===================================================== */

if(chatSendButton){

    chatSendButton.addEventListener(
        "click",
        sendChatMessage
    );

}


if(chatThreadBack){

    chatThreadBack.addEventListener(
        "click",
        closeChatThread
    );

}


if(chatThreadBackdrop){

    chatThreadBackdrop.addEventListener(
        "click",
        closeChatThread
    );

}


if(chatSearchInput){

    chatSearchInput.addEventListener(
        "input",
        renderChatList
    );

}


/* =====================================================
MORE MENU
===================================================== */

function closeChatMoreMenu(){

    if(!chatMoreMenu)
        return;

    chatMoreMenu.classList.remove(
        "active"
    );

    chatMoreMenu.setAttribute(
        "aria-hidden",
        "true"
    );

}

/* =====================================================
CHAT MORE MENU — CHANGE BACKGROUND
===================================================== */

const chatChangeBackgroundButton =
    document.getElementById(
        "chat-change-background"
    );


if(chatChangeBackgroundButton){

    chatChangeBackgroundButton.addEventListener(
        "click",
        () => {

            closeChatMoreMenu();

            openChatBackgroundPicker();

        }
    );

}


if(chatBackgroundClose){

    chatBackgroundClose.addEventListener(
        "click",
        closeChatBackgroundPicker
    );

}


if(chatBackgroundCancel){

    chatBackgroundCancel.addEventListener(
        "click",
        closeChatBackgroundPicker
    );

}


if(chatBackgroundBackdrop){

    chatBackgroundBackdrop.addEventListener(
        "click",
        closeChatBackgroundPicker
    );

}


if(chatBackgroundSystem){

    chatBackgroundSystem.addEventListener(
        "click",
        () => {

            setChatBackgroundSource(
                "system"
            );

            setBackgroundPreview(
                selectedChatBackground
            );

        }
    );

}


if(chatBackgroundGallery){

    chatBackgroundGallery.addEventListener(
        "click",
        () => {

            setChatBackgroundSource(
                "gallery"
            );


            if(
                selectedChatBackground.type !==
                "image"
            ){

                setBackgroundPreview({
                    type:"theme",
                    value:"dark"
                });

            }else{

                setBackgroundPreview(
                    selectedChatBackground
                );

            }

        }
    );

}


if(chatBackgroundThemeGrid){

    chatBackgroundThemeGrid.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-chat-background-theme]"
                );


            if(!button){

                return;

            }


            const theme =
                button.dataset.chatBackgroundTheme;


            selectedChatBackground = {

                type:"theme",

                value:theme

            };


            updateBackgroundThemeSelection(
                theme
            );


            setBackgroundPreview(
                selectedChatBackground
            );

        }
    );

}


if(chatBackgroundGalleryButton){

    chatBackgroundGalleryButton.addEventListener(
        "click",
        () => {

            if(chatBackgroundFile){

                chatBackgroundFile.click();

            }

        }
    );

}


if(chatBackgroundFile){

    chatBackgroundFile.addEventListener(
        "change",
        async event => {

            const file =
                event.target.files?.[0];


            if(
                !file
                ||
                !file.type.startsWith(
                    "image/"
                )
            ){

                return;

            }


            try{

                const compressed =
                    await compressChatBackgroundImage(
                        file
                    );


                selectedChatBackground = {

                    type:"image",

                    value:compressed

                };


                setBackgroundPreview(
                    selectedChatBackground
                );


                setChatBackgroundSource(
                    "gallery"
                );

            }catch(error){

                console.error(
                    "Unable to prepare chat background image:",
                    error
                );

            }


            event.target.value = "";

        }
    );

}


if(chatBackgroundApply){

    chatBackgroundApply.addEventListener(
        "click",
        () => {

            if(!activeChatCrushId){

                return;

            }


            applyChatBackground(
                selectedChatBackground
            );


            saveActiveChatBackground(
                selectedChatBackground
            );


            closeChatBackgroundPicker();

        }
    );

}



if(chatMoreButton){

    chatMoreButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            if(
                chatMoreMenu.classList.contains(
                    "active"
                )
            ){

                closeChatMoreMenu();

            }else{

                chatMoreMenu.classList.add(
                    "active"
                );

                chatMoreMenu.setAttribute(
                    "aria-hidden",
                    "false"
                );

            }

        }
    );

}


/* =====================================================
CHAT MORE MENU — VIEW PROFILE
===================================================== */

const chatViewProfileButton =
    document.getElementById(
        "chat-view-profile"
    );


if(chatViewProfileButton){

    chatViewProfileButton.addEventListener(
        "click",
        () => {

            closeChatMoreMenu();


            if(!activeChatCrushId){
                return;
            }


            const crush =
                SC_Mutual_FindCrush(
                    activeChatCrushId
                );


            if(!crush){
                return;
            }


            openMutualProfilePage(
                crush.id
            );

        }
    );

}



document.addEventListener(
    "click",
    event => {

        if(
            chatMoreMenu
            &&
            !chatMoreMenu.contains(
                event.target
            )
            &&
            event.target !==
                chatMoreButton
        ){

            closeChatMoreMenu();

        }

    }
);


/* =====================================================
CONFIRMATION HELPER
===================================================== */

let chatConfirmAction =
    null;


function showChatConfirmation(
    title,
    message,
    action
){

    if(!chatConfirmOverlay)
        return;


    chatConfirmTitle.textContent =
        title;

    chatConfirmMessage.textContent =
        message;


    chatConfirmAction =
        action;


    chatConfirmOverlay.classList.add(
        "active"
    );

    chatConfirmOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeChatConfirmation(){

    if(!chatConfirmOverlay)
        return;


    chatConfirmOverlay.classList.remove(
        "active"
    );

    chatConfirmOverlay.setAttribute(
        "aria-hidden",
        "true"
    );


    chatConfirmAction =
        null;

}


if(chatConfirmCancel){

    chatConfirmCancel.addEventListener(
        "click",
        closeChatConfirmation
    );

}


if(chatConfirmOk){

    chatConfirmOk.addEventListener(
        "click",
        () => {

            if(
                typeof chatConfirmAction ===
                "function"
            ){

                chatConfirmAction();

            }

            closeChatConfirmation();

        }
    );

}


/* =====================================================
CLEAR CHAT
===================================================== */

const chatClearButton =
    document.getElementById(
        "chat-clear-chat"
    );


if(chatClearButton){

    chatClearButton.addEventListener(
        "click",
        () => {

            closeChatMoreMenu();


            showChatConfirmation(

                "Clear this chat?",

                "All messages in this conversation will be removed from this device.",

                () => {

                    const store =
                        getChatStore();


                    if(activeChatCrushId){

                        delete store[
                            activeChatCrushId
                        ];

                        saveChatStore(
                            store
                        );

                    }


                    renderChatMessages();

                    renderChatList();

                }

            );

        }
    );

}


/* =====================================================
BLOCK USER
===================================================== */

const chatBlockButton =
    document.getElementById(
        "chat-block-user"
    );


if(chatBlockButton){

    chatBlockButton.addEventListener(
        "click",
        () => {

            closeChatMoreMenu();


            showChatConfirmation(

                "Block this person?",

                "They will no longer be able to interact with you.",

                () => {

                    /*
                     * Front-end placeholder.
                     *
                     * The real block must later
                     * be written to the backend.
                     */

                    closeChatThread();

                }

            );

        }
    );

}


/* =====================================================
VIDEO / VOICE CALL PLACEHOLDERS
===================================================== */

const chatVideoCall =
    document.getElementById(
        "chat-video-call"
    );

const chatVoiceCall =
    document.getElementById(
        "chat-voice-call"
    );


if(chatVideoCall){

    chatVideoCall.addEventListener(
        "click",
        () => {

            alert(
                "Video calling will be connected when the chat backend is ready."
            );

        }
    );

}


if(chatVoiceCall){

    chatVoiceCall.addEventListener(
        "click",
        () => {

            alert(
                "Voice calling will be connected when the chat backend is ready."
            );

        }
    );

}


/* =====================================================
VOICE MESSAGE PLACEHOLDER
===================================================== */

const chatVoiceMessageButton =
    document.getElementById(
        "chat-voice-message-button"
    );


if(chatVoiceMessageButton){

    chatVoiceMessageButton.addEventListener(
        "click",
        () => {

            alert(
                "Voice messages will be connected to audio recording later."
            );

        }
    );

}

/* =====================================================
MODULE: CHAT MEDIA ATTACHMENTS
===================================================== */

const chatAttachButton =
    document.getElementById(
        "chat-attach-button"
    );

const chatAttachmentOverlay =
    document.getElementById(
        "sc-chat-attachment-overlay"
    );

const chatAttachmentBackdrop =
    document.getElementById(
        "sc-chat-attachment-backdrop"
    );

const chatAttachmentClose =
    document.getElementById(
        "sc-chat-attachment-close"
    );

const chatGalleryButton =
    document.getElementById(
        "sc-chat-gallery-button"
    );

const chatCameraButton =
    document.getElementById(
        "sc-chat-camera-button"
    );

const chatGalleryInput =
    document.getElementById(
        "sc-chat-gallery-input"
    );

const chatCameraInput =
    document.getElementById(
        "sc-chat-camera-input"
    );

const chatMediaPreview =
    document.getElementById(
        "sc-chat-media-preview"
    );

const chatMediaPreviewList =
    document.getElementById(
        "sc-chat-media-preview-list"
    );

const chatMediaPreviewClear =
    document.getElementById(
        "sc-chat-media-preview-clear"
    );


let pendingChatMedia =
    [];


function openChatAttachmentPicker(){

    if(!chatAttachmentOverlay){

        return;

    }


    chatAttachmentOverlay.classList.add(
        "active"
    );


    chatAttachmentOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeChatAttachmentPicker(){

    if(!chatAttachmentOverlay){

        return;

    }


    chatAttachmentOverlay.classList.remove(
        "active"
    );


    chatAttachmentOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

}


function clearPendingChatMedia(){

    pendingChatMedia.forEach(
        item => {

            if(item.previewUrl){

                URL.revokeObjectURL(
                    item.previewUrl
                );

            }

        }
    );


    pendingChatMedia = [];


    renderPendingChatMedia();


    if(chatMediaPreview){

        chatMediaPreview.classList.remove(
            "active"
        );

    }

}


function renderPendingChatMedia(){

    if(!chatMediaPreviewList){

        return;

    }


    chatMediaPreviewList.innerHTML = "";


    pendingChatMedia.forEach(
        (item,index) => {

            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "sc-chat-media-preview-item";


            if(
                item.type === "video"
            ){

                wrapper.innerHTML = `

                    <video
                        src="${item.previewUrl}"
                        muted
                        playsinline
                    ></video>

                    <span
                        class="sc-chat-media-preview-video-icon"
                    >
                        ▶
                    </span>

                `;

            }

            else{

                wrapper.innerHTML = `

                    <img
                        src="${item.previewUrl}"
                        alt=""
                    >

                `;

            }


            const remove =
                document.createElement(
                    "button"
                );


            remove.type =
                "button";


            remove.className =
                "sc-chat-media-preview-remove";


            remove.textContent =
                "×";


            remove.addEventListener(
                "click",
                () => {

                    const removed =
                        pendingChatMedia.splice(
                            index,
                            1
                        )[0];


                    if(
                        removed?.previewUrl
                    ){

                        URL.revokeObjectURL(
                            removed.previewUrl
                        );

                    }


                    renderPendingChatMedia();


                    if(
                        !pendingChatMedia.length
                    ){

                        chatMediaPreview.classList.remove(
                            "active"
                        );

                    }

                }
            );


            wrapper.appendChild(
                remove
            );


            chatMediaPreviewList.appendChild(
                wrapper
            );

        }
    );


    if(
        pendingChatMedia.length
        &&
        chatMediaPreview
    ){

        chatMediaPreview.classList.add(
            "active"
        );

    }

}


function prepareSelectedChatMedia(
    files
){

    const incoming =
        Array.from(
            files || []
        );


    if(!incoming.length){

        return;

    }


    const available =
        9 -
        pendingChatMedia.length;


    const selected =
        incoming.slice(
            0,
            Math.max(
                0,
                available
            )
        );


    selected.forEach(
        file => {

            if(
                !file.type.startsWith(
                    "image/"
                )
                &&
                !file.type.startsWith(
                    "video/"
                )
            ){

                return;

            }


            pendingChatMedia.push({

                file,

                type:
                    file.type.startsWith(
                        "video/"
                    )
                        ? "video"
                        : "image",

                previewUrl:
                    URL.createObjectURL(
                        file
                    )

            });

        }
    );


    renderPendingChatMedia();

}


if(chatAttachButton){

    chatAttachButton.addEventListener(
        "click",
        openChatAttachmentPicker
    );

}


if(chatAttachmentClose){

    chatAttachmentClose.addEventListener(
        "click",
        closeChatAttachmentPicker
    );

}


if(chatAttachmentBackdrop){

    chatAttachmentBackdrop.addEventListener(
        "click",
        closeChatAttachmentPicker
    );

}


if(chatGalleryButton){

    chatGalleryButton.addEventListener(
        "click",
        () => {

            closeChatAttachmentPicker();


            if(chatGalleryInput){

                chatGalleryInput.click();

            }

        }
    );

}


if(chatCameraButton){

    chatCameraButton.addEventListener(
        "click",
        () => {

            closeChatAttachmentPicker();


            if(chatCameraInput){

                chatCameraInput.click();

            }

        }
    );

}


if(chatGalleryInput){

    chatGalleryInput.addEventListener(
        "change",
        event => {

            prepareSelectedChatMedia(
                event.target.files
            );


            event.target.value =
                "";

        }
    );

}


if(chatCameraInput){

    chatCameraInput.addEventListener(
        "change",
        event => {

            prepareSelectedChatMedia(
                event.target.files
            );


            event.target.value =
                "";

        }
    );

}


if(chatMediaPreviewClear){

    chatMediaPreviewClear.addEventListener(
        "click",
        clearPendingChatMedia
    );

}


/* =====================================================
END CHAT SYSTEM
===================================================== */



/* =====================================================
MODULE: SENT CRUSHES — DETAIL EXPERIENCE
===================================================== */


/* -----------------------------------------------------
REFERENCES
----------------------------------------------------- */

const sentCrushView =
    document.getElementById(
        "sent-crush-view"
    );

const sentCrushBackdrop =
    document.getElementById(
        "sent-crush-backdrop"
    );

const sentCrushBack =
    document.getElementById(
        "sent-crush-back"
    );

const sentCrushList =
    document.getElementById(
        "sent-crush-list"
    );

const sentCrushCount =
    document.getElementById(
        "sent-crush-count"
    );


const sentCrushDetailView =
    document.getElementById(
        "sent-crush-detail-view"
    );

const sentCrushDetailBack =
    document.getElementById(
        "sent-crush-detail-back"
    );

const sentCrushDetailProfile =
    document.getElementById(
        "sent-crush-detail-profile"
    );

const sentCrushDetailInfo =
    document.getElementById(
        "sent-crush-detail-info"
    );

const sentCrushDetailClues =
    document.getElementById(
        "sent-crush-detail-clues"
    );

const sentCrushDetailClueCount =
    document.getElementById(
        "sent-crush-detail-clue-count"
    );

const sentCrushDetailGolden =
    document.getElementById(
        "sent-crush-detail-golden-clues"
    );

const sentCrushDetailReveals =
    document.getElementById(
        "sent-crush-detail-reveals"
    );

const sentCrushGameProgress =
    document.getElementById(
        "sent-crush-game-progress"
    );

const sentCrushDetailActions =
    document.getElementById(
        "sent-crush-detail-bottom-actions"
    );

const sentCrushDetailTrack =
    document.getElementById(
        "sent-crush-detail-track"
    );


const sentCrushAddClue =
    document.getElementById(
        "sent-crush-add-clue"
    );

const sentCrushSecretNote =
    document.getElementById(
        "sent-crush-secret-note"
    );


const sentCrushClueOverlay =
    document.getElementById(
        "sent-crush-clue-overlay"
    );

const sentCrushClueOverlayBackdrop =
    document.getElementById(
        "sent-crush-clue-overlay-backdrop"
    );

const sentCrushClueClose =
    document.getElementById(
        "sent-crush-clue-close"
    );

const sentCrushClueSlots =
    document.getElementById(
        "sent-crush-clue-slots"
    );

const sentCrushClueRemaining =
    document.getElementById(
        "sent-crush-clue-remaining-count"
    );


let activeSentCrushId =
    null;

/* -----------------------------------------------------
STORAGE
----------------------------------------------------- */

const SENT_CRUSH_STORAGE_KEY =
    "secretCrushSentItems";


function getSentCrushes(){

    let items = [];


    try{

        items =
            JSON.parse(
                localStorage.getItem(
                    SENT_CRUSH_STORAGE_KEY
                ) ||
                "[]"
            );

    }catch(error){

        items = [];

    }


    if(!Array.isArray(items)){

        return [];

    }


    return items.filter(
        item => {

            return (
                item &&
                item.type === "crush" &&
                item.status !== "Unsent"
            );

        }
    );

}


/* -----------------------------------------------------
DEMO SENT CRUSHES
----------------------------------------------------- */

/* -----------------------------------------------------
SENT CRUSH DISPLAY DATA

IMPORTANT:
Real saved crushes ALWAYS take priority.

The two demo crushes are only shown when the user
has never created any Sent Crush storage at all.
===================================================== */

function getSentCrushDisplayData(){

    const saved =
        getSentCrushes();


    const hasStorage =
        localStorage.getItem(
            SENT_CRUSH_STORAGE_KEY
        ) !== null;


    /*
     * If the app has Sent Crush storage, use ONLY
     * the real saved crushes.
     */

    if(hasStorage){

        return saved;

    }


    /*
     * Otherwise provide the original two demo
     * crushes for a brand-new installation.
     */

    return [

        {
            id:
                "demo-sent-claire",

            type:
                "crush",

            targetId:
                "claire-demo-001",

            targetName:
                "Claire",

            targetSnapshot:{

                id:
                    "claire-demo-001",

                username:
                    "@claire",

                name:
                    "Claire",

                photo:
                    "",

                school:
                    "Daystar University",

                faculty:
                    "Business & Economics",

                year:
                    "2nd Year"

            },

            selectedFields:[
                "faculty",
                "year"
            ],

            clues:[
                "We have probably crossed paths before.",
                "You enjoy music.",
                "You have a favourite study spot."
            ],

            goldenClues:[
                "There is a place on campus where I first noticed you."
            ],

            level:
                2,

            status:
                "Round 2 in progress",

            mutual:
                true,

            revealRequests:[
                "name"
            ],

            extraCluesByRound:{
                1:[],
                2:[],
                3:[]
            },

            createdAt:
                Date.now() - 86400000

        },


        {
            id:
                "demo-sent-brian",

            type:
                "crush",

            targetId:
                "brian-demo-002",

            targetName:
                "Brian",

            targetSnapshot:{

                id:
                    "brian-demo-002",

                username:
                    "@brian",

                name:
                    "Brian",

                photo:
                    "",

                school:
                    "Kenyatta University",

                faculty:
                    "Engineering",

                year:
                    "1st Year"

            },

            selectedFields:[
                "faculty"
            ],

            clues:[
                "You enjoy football.",
                "I have seen you around campus."
            ],

            goldenClues:[
                "The first place I noticed you was near a busy campus spot."
            ],

            level:
                1,

            status:
                "Round 1 in progress",

            mutual:
                false,

            revealRequests:[],

            extraCluesByRound:{
                1:[],
                2:[],
                3:[]
            },

            createdAt:
                Date.now() - 172800000

        }

    ].filter(
        sentCrush =>
            !getWithdrawnCrushRecords().some(
                record =>
                    record.id ===
                    sentCrush.id
            )
    );

}


/* -----------------------------------------------------
GET TARGET PROFILE
----------------------------------------------------- */

function getSentCrushTarget(
    sentCrush
){

    /*
     * Prefer the snapshot captured at send time —
     * this is what makes it work for crushes sent to
     * real feed posts and moments, not just the fixed
     * demo people in SC_DEMO_CRUSHES.
     */

    if(sentCrush.targetSnapshot){

        return sentCrush.targetSnapshot;

    }


    return (
        SC_DEMO_CRUSHES.find(
            crush =>
                (
                    sentCrush.targetId &&
                    crush.id ===
                    sentCrush.targetId
                )
                ||
                crush.name ===
                sentCrush.targetName
        )
        ||
        null
    );

}


/* -----------------------------------------------------
MUTUAL CHECK
----------------------------------------------------- */

function sentCrushIsMutual(
    sentCrush
){

    const target =
        getSentCrushTarget(
            sentCrush
        );


    return !!(
        sentCrush.mutual === true
        ||
        (
            target &&
            target.mutual === true
        )
    );

}


/* =====================================================
OPEN SENT CRUSHES
===================================================== */

function openSentCrushes(){

    if(!sentCrushView){

        return;

    }


    renderSentCrushes();


    sentCrushView.classList.add(
        "active"
    );

    sentCrushView.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* =====================================================
CLOSE SENT CRUSHES
===================================================== */

function closeSentCrushes(){

    closeSentCrushDetail();

    closeSentCrushClueOverlay();


    if(!sentCrushView){

        return;

    }


    sentCrushView.classList.remove(
        "active"
    );

    sentCrushView.setAttribute(
        "aria-hidden",
        "true"
    );


    openActivityHub();

}


/* =====================================================
RENDER LIST
===================================================== */

function renderSentCrushes(){

    if(!sentCrushList){

        return;

    }


    const crushes =
        getSentCrushDisplayData();


    if(sentCrushCount){

        sentCrushCount.textContent =
            crushes.length
                ? `${crushes.length} crush${crushes.length === 1 ? "" : "es"} sent`
                : "No crushes sent yet";

    }


    sentCrushList.innerHTML = "";


    crushes.forEach(
        sentCrush => {

            const target =
                getSentCrushTarget(
                    sentCrush
                );


            const mutual =
                sentCrushIsMutual(
                    sentCrush
                );


            const clues =
                Array.isArray(
                    sentCrush.clues
                )
                    ? sentCrush.clues
                    : [];


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "sent-crush-card";


            card.dataset.crushId =
                sentCrush.id;


            card.addEventListener(
                "click",
                event => {

                    if(
                        event.target.closest(
                            "button"
                        )
                    ){

                        return;

                    }


                    openSentCrushDetail(
                        sentCrush.id
                    );

                }
            );


            /*
             * LONG PRESS TO UNSEND
             *
             * unsendSentCrush() already handles its
             * own confirm dialog and removes the crush
             * from storage — this just wires up the
             * gesture that triggers it.
             */

            let sentCrushPressTimer = null;
            let sentCrushPressHandled = false;

            const startSentCrushPress = () => {

                clearTimeout(sentCrushPressTimer);

                sentCrushPressHandled = false;

                sentCrushPressTimer = setTimeout(() => {

                    sentCrushPressHandled = true;

                    unsendSentCrush(sentCrush.id);

                }, 500);

            };

            const cancelSentCrushPress = () => {

                clearTimeout(sentCrushPressTimer);

            };

            card.addEventListener("touchstart", startSentCrushPress, { passive:true });
            card.addEventListener("touchend", cancelSentCrushPress);
            card.addEventListener("touchmove", cancelSentCrushPress);

            card.addEventListener("mousedown", startSentCrushPress);
            card.addEventListener("mouseup", cancelSentCrushPress);
            card.addEventListener("mouseleave", cancelSentCrushPress);

            card.addEventListener("contextmenu", event => {

                event.preventDefault();

                /*
                 * On mobile, a long touch-hold can fire
                 * both our timer AND the browser's own
                 * contextmenu event for the same press —
                 * skip this if the timer already handled it.
                 */

                if(sentCrushPressHandled) return;

                unsendSentCrush(sentCrush.id);

                    });
            

            card.innerHTML = `

                <div
                    class="sent-crush-profile"
                >
${
                        target &&
                        target.photo

                            ?

                            `
                            <img
                                src="${target.photo}"
                                alt=""
                                class="sent-crush-photo"
                            >
                            `

                            :

                            `
                            <div
                                class="
                                    sent-crush-photo
                                    known-photo
                                "
                            >
                                🧑
                            </div>
                            `
                    }


                    <div
                        class="sent-crush-profile-info"
                    >

                        <div
                            class="sent-crush-name-row"
                        >

                            <span
                                class="sent-crush-name"
                            >
                                ${escapePostHTML(
                                    sentCrush.targetName ||
                                    "Secret Crush"
                                )}
                            </span>


                            ${
                                mutual

                                    ?

                                    `
                                    <span
                                        class="
                                            sent-crush-mutual-badge
                                        "
                                    >
                                        ♡ MUTUAL
                                    </span>
                                    `

                                    :

                                    ""
                            }

                        </div>


                        ${
                            target && target.username
                                ? `
                                    <span class="sent-crush-username">
                                        ${escapePostHTML(target.username)}
                                    </span>
                                `
                                : ""
                        }


                        ${
                            target && (target.faculty || target.year)
                                ? `
                                    <span class="sent-crush-meta-line">
                                        ${escapePostHTML(
                                            [target.faculty, target.year]
                                                .filter(Boolean)
                                                .join(" • ")
                                        )}
                                    </span>
                                `
                                : ""
                        }


                        <span
                            class="sent-crush-status"
                        >
                            ${
                                mutual
                                    ? "They like you back."
                                    : "Your crush is still in progress."
                            }
                        </span>

                    </div>


                    <span
                        class="sent-crush-card-arrow"
                    >
                        ›
                    </span>

                </div>


                <div
                    class="sent-crush-section"
                >

                    <div
                        class="
                            sent-crush-section-header
                        "
                    >

                        <strong>
                            Information revealed
                        </strong>

                    </div>


                    <div
                        class="sent-crush-info-grid"
                    >

                        ${createSentCrushInfoItem(
                            "Name",
                            (
                                sentCrush.selectedFields ||
                                []
                            ).includes("name")
                        )}

                        ${createSentCrushInfoItem(
                            "Faculty",
                            (
                                sentCrush.selectedFields ||
                                []
                            ).includes("faculty")
                        )}

                        ${createSentCrushInfoItem(
                            "Year",
                            (
                                sentCrush.selectedFields ||
                                []
                            ).includes("year")
                        )}

                        ${createSentCrushInfoItem(
                            "Picture",
                            (
                                sentCrush.selectedFields ||
                                []
                            ).includes("picture")
                        )}

                    </div>

                </div>


                <div
                    class="sent-crush-progress"
                >

                    <div
                        class="
                            sent-crush-progress-title
                        "
                    >
                        ${
                            mutual
                                ? "💜 MUTUAL CRUSH"
                                : `♡ ROUND ${Number(sentCrush.level) || 1}`
                        }
                    </div>


                    <p>
                        ${
                            mutual
                                ? "You both chose each other."
                                : (
                                    sentCrush.status ||
                                    "Game in progress."
                                )
                        }
                    </p>

                </div>


                <div
                    class="sent-crush-actions"
                >

                    ${
                        mutual

                            ?

                            `
                            <button
                                type="button"
                                class="sent-crush-chat"
                                data-chat-crush="${sentCrush.id}"
                            >
                                💬 CHAT
                            </button>
                            `

                            :

                            ""
                    }


                    <button
                        type="button"
                        class="sent-crush-gift"
                        data-gift-crush="${sentCrush.id}"
                    >
                        🎁 SEND GIFT
                    </button>

                </div>

            `;


            sentCrushList.appendChild(
                card
            );

        }
    );


    attachSentCrushListActions();

}


/* -----------------------------------------------------
INFO ITEM
----------------------------------------------------- */

function createSentCrushInfoItem(
    label,
    revealed
){

    return `

        <div
            class="sent-crush-info-item"
        >

            <span>
                ${label}
            </span>

            <span
                class="${
                    revealed
                        ? "revealed"
                        : "hidden"
                }"
            >
                ${
                    revealed
                        ? "✓ Revealed"
                        : "🔒 Hidden"
                }
            </span>

        </div>

    `;

}


/* =====================================================
OPEN DETAIL
===================================================== */

function openSentCrushDetail(
    crushId
){

    const crush =
        getSentCrushDisplayData()
            .find(
                item =>
                    item.id ===
                    crushId
            );


    if(
        !crush ||
        !sentCrushDetailView
    ){

        return;

    }


    activeSentCrushId =
        crushId;


    renderSentCrushDetail(
        crush
    );


    sentCrushDetailView.classList.add(
        "active"
    );

    sentCrushDetailView.setAttribute(
        "aria-hidden",
        "false"
    );


    if(sentCrushDetailTrack){

        sentCrushDetailTrack.scrollLeft =
            0;

    }


    updateSentCrushSlideDots();

}


/* =====================================================
CLOSE DETAIL
===================================================== */

function closeSentCrushDetail(){

    if(!sentCrushDetailView){

        return;

    }


    sentCrushDetailView.classList.remove(
        "active"
    );

    sentCrushDetailView.setAttribute(
        "aria-hidden",
        "true"
    );


    activeSentCrushId =
        null;

}


/* =====================================================
RENDER DETAIL
===================================================== */

function renderSentCrushDetail(
    sentCrush
){

    const target =
        getSentCrushTarget(
            sentCrush
        );


    const mutual =
        sentCrushIsMutual(
            sentCrush
        );


    /* PROFILE */

    if(sentCrushDetailProfile){

        sentCrushDetailProfile.innerHTML = `

            ${
                target &&
                target.photo

                    ?

                    `
                    <img
                        src="${target.photo}"
                        alt=""
                        class="
                            sent-crush-detail-avatar
                        "
                    >
                    `

                    :



                    `
                    <div
                        class="
                            sent-crush-detail-avatar
                            known
                        "
                    >
                        🧑
                    </div>
                    `
            }


            <div
                class="sent-crush-detail-user"
            >

                <h3>
                    ${escapePostHTML(
                        target?.name ||
                        sentCrush.targetName ||
                        "Secret Crush"
                    )}
                </h3>


                <span
                    class="
                        sent-crush-detail-username
                    "
                >
                    ${escapePostHTML(
                        target?.username ||
                        "@username"
                    )}
                </span>


                <div
                    class="sent-crush-detail-meta"
                >
<span>
                        🏫
                        ${escapePostHTML(
                            target?.school ||
                            "Not set"
                        )}
                    </span>

                    <span>
                        🎓
                        ${escapePostHTML(
                            target?.faculty ||
                            "Not set"
                        )}
                    </span>

                    <span>
                        📚
                        ${escapePostHTML(
                            target?.year ||
                            "Not set"
                        )}
                    </span>

                </div>

            </div>

        `;

    }


    /* REVEALED INFORMATION */

    const selected =
        sentCrush.selectedFields ||
        [];


    if(sentCrushDetailInfo){

        sentCrushDetailInfo.innerHTML = `

            ${createDetailInformation(
                "Name",
                selected.includes("name")
                    ? target?.name || sentCrush.targetName
                    : null
            )}

            ${createDetailInformation(
                "Faculty",
                selected.includes("faculty")
                    ? target?.faculty
                    : null
            )}

            ${createDetailInformation(
                "Year",
                selected.includes("year")
                    ? target?.year
                    : null
            )}

            ${createDetailInformation(
                "Profile Picture",
                selected.includes("picture")
                    ? "Revealed"
                    : null
            )}

        `;

    }


    /* CLUES */

    const clues =
        Array.isArray(
            sentCrush.clues
        )
            ? sentCrush.clues
            : [];


    if(sentCrushDetailClueCount){

        sentCrushDetailClueCount.textContent =
            clues.length;

    }


    if(sentCrushDetailClues){

        sentCrushDetailClues.innerHTML =
            clues.length

                ?

                clues.map(
                    clue => `

                        <div
                            class="
                                sent-crush-detail-clue
                            "
                        >

                            <span
                                class="
                                    sent-crush-detail-clue-icon
                                "
                            >
                                ✦
                            </span>

                            <span
                                class="
                                    sent-crush-detail-clue-text
                                "
                            >
                                ${escapePostHTML(
                                    clue
                                )}
                            </span>

                        </div>

                    `
                ).join("")

                :

                `
                <div
                    class="sent-crush-detail-clue-text"
                >
                    No clues have been given yet.
                </div>
                `;

    }


    /* GOLDEN CLUES */

    const golden =
        sentCrush.goldenClues ||
        [];


    if(sentCrushDetailGolden){

        sentCrushDetailGolden.innerHTML =
            golden.length

                ?

                golden.map(
                    clue => `

                        <div
                            class="
                                sent-crush-golden-clue
                            "
                        >

                            <span>
                                ✨
                            </span>

                            <span>
                                ${escapePostHTML(
                                    clue
                                )}
                            </span>

                        </div>

                    `
                ).join("")

                :

                `
                <div
                    class="
                        sent-crush-detail-clue-text
                    "
                >
                    No golden clue has been given yet.
                </div>
                `;

    }


    renderSentCrushRevealRequests(
        sentCrush
    );


    renderSentCrushGameProgress(
        sentCrush
    );


    renderSentCrushBottomActions(
        sentCrush,
        mutual
    );

}


/* -----------------------------------------------------
DETAIL INFORMATION HELPER
----------------------------------------------------- */

function createDetailInformation(
    label,
    value
){

    return `

        <div
            class="
                sent-crush-detail-info-item
            "
        >

            <strong>
                ${label}
            </strong>

            ${
                value

                    ?

                    `
                    <span class="revealed">
                        ✓ ${escapePostHTML(
                            value
                        )}
                    </span>
                    `

                    :

                    `
                    <span class="hidden">
                        🔒 Hidden
                    </span>
                    `
            }

        </div>

    `;

}


/* =====================================================
REVEAL REQUESTS
===================================================== */

function renderSentCrushRevealRequests(
    sentCrush
){

    if(!sentCrushDetailReveals){

        return;

    }


    const requests =
        Array.isArray(
            sentCrush.revealRequests
        )
            ? sentCrush.revealRequests
            : [];


    if(!requests.length){

        sentCrushDetailReveals.innerHTML = `

            <div
                class="
                    sent-crush-no-requests
                "
            >

                <div
                    class="
                        sent-crush-no-requests-icon
                    "
                >
                    🔐
                </div>

                <strong>
                    No reveal requests yet
                </strong>

                <p>
                    If your crush asks you to reveal
                    part of your identity, their
                    request will appear here.
                </p>

            </div>

        `;

        return;

    }


    sentCrushDetailReveals.innerHTML =
        requests.map(
            field => `

                <div
                    class="
                        sent-crush-reveal-card
                    "
                >

                    <div
                        class="
                            sent-crush-reveal-title
                        "
                    >
                        🔐 Reveal Request
                    </div>


                    <p
                        class="
                            sent-crush-reveal-text
                        "
                    >
                        Your crush is asking you to
                        reveal your
                        <strong>
                            ${escapePostHTML(
                                field
                            )}
                        </strong>.
                    </p>


                    <div
                        class="
                            sent-crush-reveal-actions
                        "
                    >

                        <button
                            type="button"
                            class="
                                sent-crush-reveal-accept
                            "
                            data-accept-detail-reveal="${sentCrush.id}|${escapePostHTML(field)}"
                        >
                            ACCEPT
                        </button>


                        <button
                            type="button"
                            class="
                                sent-crush-reveal-decline
                            "
                            data-decline-detail-reveal="${sentCrush.id}|${escapePostHTML(field)}"
                        >
                            DECLINE
                        </button>

                    </div>

                </div>

            `
        ).join("");


    sentCrushDetailReveals
        .querySelectorAll(
            "[data-accept-detail-reveal]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const parts =
                            button.dataset
                                .acceptDetailReveal
                                .split("|");


                        acceptSentCrushRevealRequest(
                            parts[0],
                            parts[1]
                        );

                    }
                );

            }
        );


    sentCrushDetailReveals
        .querySelectorAll(
            "[data-decline-detail-reveal]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const parts =
                            button.dataset
                                .declineDetailReveal
                                .split("|");


                        declineSentCrushRevealRequest(
                            parts[0],
                            parts[1]
                        );

                    }
                );

            }
        );

}


/* =====================================================
REVEAL REQUEST ACTIONS
===================================================== */

function acceptSentCrushRevealRequest(
    crushId,
    field
){

    const crush =
        getSentCrushDisplayData()
            .find(
                item =>
                    item.id ===
                    crushId
            );


    if(!crush){

        return;

    }


    if(
        !Array.isArray(
            crush.acceptedRevealFields
        )
    ){

        crush.acceptedRevealFields = [];

    }


    if(
        !crush.acceptedRevealFields.includes(
            field
        )
    ){

        crush.acceptedRevealFields.push(
            field
        );

    }


    crush.revealRequests =
        (
            crush.revealRequests ||
            []
        ).filter(
            item =>
                item !== field
        );


    saveSentCrushData(
        crush
    );
    
    const revealTarget =
    getSentCrushTarget(
        crush
    ) ||
    {};


SC_OtherActivity_Add({

    id:
        "reveal-accepted-" +
        crush.id +
        "-" +
        field +
        "-" +
        (
            crush.updatedAt ||
            Date.now()
        ),

    actorId:
        revealTarget.id ||
        crush.targetId ||
        crush.id,

    actorSnapshot:{

        id:
            revealTarget.id ||
            crush.targetId ||
            crush.id,

        name:
            revealTarget.name ||
            crush.targetName ||
            "Mystery sender",

        username:
            revealTarget.username ||
            "",

        photo:
            revealTarget.photo ||
            revealTarget.profilePicture ||
            ""

    },

    type:
        "reveal_accepted",

    title:
        `You revealed your ${field} to ${revealTarget.name || crush.targetName || "your crush"}`,

    description:
        "The reveal has been recorded in your activity history.",

    timestamp:
        Date.now(),

    read:
        true,

    route:{

        type:
            "sent-crush-reveal",

        crushId:
            crush.id,

        slide:
            1

    },

    meta:{
        field
    }

});


    alert(
        `Your ${field} has been revealed to your crush.`
    );


    renderSentCrushDetail(
        crush
    );
    
    

}


function declineSentCrushRevealRequest(
    crushId,
    field
){

    const crush =
        getSentCrushDisplayData()
            .find(
                item =>
                    item.id ===
                    crushId
            );


    if(!crush){

        return;

    }


    crush.revealRequests =
        (
            crush.revealRequests ||
            []
        ).filter(
            item =>
                item !== field
        );


    saveSentCrushData(
        crush
    );


    renderSentCrushDetail(
        crush
    );

}


/* =====================================================
SAVE SENT CRUSH
===================================================== */

function saveSentCrushData(
    crush
){

    const stored =
        getSentCrushes();


    const index =
        stored.findIndex(
            item =>
                item.id ===
                crush.id
        );


    if(index >= 0){

        stored[index] =
            crush;

    }else{

        stored.push(
            crush
        );

    }


    localStorage.setItem(
        SENT_CRUSH_STORAGE_KEY,
        JSON.stringify(
            stored
        )
    );
    
    const savedCrush =
    stored.find(
        item =>
            item.id === crush.id
    );


if(savedCrush){

    savedCrush.updatedAt =
        Date.now();

}

}


/* =====================================================
GAME PROGRESS
===================================================== */

function renderSentCrushGameProgress(
    sentCrush
){

    if(!sentCrushGameProgress){

        return;

    }


    const level =
        Math.min(
            3,
            Math.max(
                1,
                Number(
                    sentCrush.level
                ) || 1
            )
        );


    const mutual =
        sentCrushIsMutual(
            sentCrush
        );


    sentCrushGameProgress.innerHTML = `

        <div
            class="
                sent-crush-progress-card
            "
        >

            <div
                class="
                    sent-crush-progress-state
                "
            >

                ${
                    mutual
                        ? "💜 Mutual Crush"
                        : escapePostHTML(
                            sentCrush.status ||
                            `Round ${level} in progress`
                        )
                }

            </div>


            <p
                class="
                    sent-crush-progress-description
                "
            >

                ${
                    mutual

                        ?

                        "You both chose each other. The crush has become mutual."

                        :

                        `Your crush is currently working through Round ${level}.`
                }

            </p>


            <div
                class="
                    sent-crush-progress-steps
                "
            >

                ${createProgressStep(
                    1,
                    level,
                    "Round 1"
                )}

                ${createProgressStep(
                    2,
                    level,
                    "Round 2"
                )}

                ${createProgressStep(
                    3,
                    level,
                    "Round 3"
                )}

            </div>

        </div>

    `;

}


/* -----------------------------------------------------
PROGRESS STEP
----------------------------------------------------- */

function createProgressStep(
    number,
    current,
    label
){

    const completed =
        number < current;


    const active =
        number === current;


    return `

        <div
            class="
                sent-crush-progress-step
                ${
                    completed
                        ? "completed"
                        : ""
                }
                ${
                    active
                        ? "current"
                        : ""
                }
            "
        >

            <div
                class="
                    sent-crush-progress-dot
                "
            >
                ${
                    completed
                        ? "✓"
                        : number
                }
            </div>


            <strong>
                ${label}
            </strong>


            <small>
                ${
                    completed
                        ? "Passed"
                        : active
                            ? "In progress"
                            : "Locked"
                }
            </small>

        </div>

    `;

}


/* =====================================================
BOTTOM ACTIONS
===================================================== */

function renderSentCrushBottomActions(
    sentCrush,
    mutual
){

    if(!sentCrushDetailActions){

        return;

    }


    sentCrushDetailActions.innerHTML = `

        ${
            mutual

                ?

                `
                <button
                    type="button"
                    class="
                        sent-crush-detail-chat
                    "
                    data-detail-chat="${sentCrush.id}"
                >
                    💬 CHAT
                </button>
                `

                :

                ""
        }


        <button
            type="button"
            class="
                sent-crush-detail-gift
            "
            data-detail-gift="${sentCrush.id}"
        >
            🎁 SEND GIFT
        </button>

    `;


    const chatButton =
        sentCrushDetailActions
            .querySelector(
                "[data-detail-chat]"
            );


    if(chatButton){

        chatButton.addEventListener(
            "click",
            () => {

                const target =
                    getSentCrushTarget(
                        sentCrush
                    );


                if(
                    target &&
                    typeof openChatThread ===
                    "function"
                ){

                    closeSentCrushDetail();

                    closeSentCrushes();


                    setTimeout(
                        () => {

                            openChatThread(
                                target
                            );

                        },
                        180
                    );

                }

            }
        );

    }


    const giftButton =
        sentCrushDetailActions
            .querySelector(
                "[data-detail-gift]"
            );


    if(giftButton){

        giftButton.addEventListener(
            "click",
            () => {

                alert(
                    "Gift sending will be connected to the Gift system."
                );

            }
        );

    }

}


/* =====================================================
ADD CLUES OVERLAY
===================================================== */

function openSentCrushClueOverlay(){

    if(
        !sentCrushClueOverlay ||
        !activeSentCrushId
    ){

        return;

    }


    const crush =
        getSentCrushes()
            .find(
                item =>
                    item.id ===
                    activeSentCrushId
            );


    if(!crush){

        return;

    }


    const currentRound =
        Math.min(
            3,
            Math.max(
                1,
                Number(crush.level) || 1
            )
        );


    const used =
        Array.isArray(
            crush.extraCluesByRound?.[
                currentRound
            ]
        )
            ? crush.extraCluesByRound[
                currentRound
            ]
            : [];


    /*
     * ALL THREE CLUES HAVE ALREADY BEEN USED.
     *
     * Do not open the overlay.
     */

    if(
        used.length >= 3
    ){

        alert(
            "You have already used all 3 additional clues for this round."
        );

        return;

    }


    renderSentCrushClueSlots();


    sentCrushClueOverlay.classList.add(
        "active"
    );


    sentCrushClueOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeSentCrushClueOverlay(){

    if(!sentCrushClueOverlay){

        return;

    }


    sentCrushClueOverlay.classList.remove(
        "active"
    );

    sentCrushClueOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =====================================================
CLUE SLOTS
===================================================== */

function renderSentCrushClueSlots(){

    if(
        !sentCrushClueSlots ||
        !activeSentCrushId
    ){

        return;

    }


    const crush =
        getSentCrushes()
            .find(
                item =>
                    item.id ===
                    activeSentCrushId
            );


    if(!crush){

        return;

    }


    const currentRound =
        Math.min(
            3,
            Math.max(
                1,
                Number(crush.level) || 1
            )
        );


    if(!crush.extraCluesByRound){

        crush.extraCluesByRound = {};

    }


    if(
        !Array.isArray(
            crush.extraCluesByRound[
                currentRound
            ]
        )
    ){

        crush.extraCluesByRound[
            currentRound
        ] = [];

    }


    const used =
        crush.extraCluesByRound[
            currentRound
        ];


    const remaining =
        Math.max(
            0,
            3 - used.length
        );


    if(sentCrushClueRemaining){

        sentCrushClueRemaining.textContent =
            remaining;

    }


    sentCrushClueSlots.innerHTML = "";


    /*
     * NOTHING LEFT.
     */

    if(!remaining){

        sentCrushClueSlots.innerHTML = `

            <div class="sent-crush-clue-empty">

                You have used all 3 additional
                clues for this round.

            </div>

        `;

        return;

    }


    /*
     * Create ONLY the unused clue slots.
     *
     * This means:
     *
     * 3 unused → 3 slots
     * 2 unused → 2 slots
     * 1 unused → 1 slot
     */

    for(
        let slotNumber = 0;
        slotNumber < 3;
        slotNumber++
    ){

        if(
            used[slotNumber]
        ){

            continue;

        }


        const slot =
            document.createElement(
                "div"
            );


        slot.className =
            "sent-crush-clue-slot locked";


        slot.dataset.clueIndex =
            slotNumber;


        slot.innerHTML = `

            <div
                class="sent-crush-clue-slot-header"
            >

                <span
                    class="sent-crush-clue-slot-title"
                >
                    🔒 Extra Clue ${slotNumber + 1}
                </span>


                <span
                    class="sent-crush-clue-slot-price"
                >
                    10 🪙
                </span>

            </div>


            <p>
                Tap to unlock this clue slot.
            </p>

        `;


        slot.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();


                unlockSentCrushClueSlot(
                    slotNumber
                );

            }
        );


        sentCrushClueSlots.appendChild(
            slot
        );

    }

}



/* =====================================================
UNLOCK EXTRA CLUE
===================================================== */

function unlockSentCrushClueSlot(
    index
){

    const crush =
        getSentCrushes()
            .find(
                item =>
                    item.id ===
                    activeSentCrushId
            );


    if(!crush){

        return;

    }


    const currentRound =
        Math.min(
            3,
            Math.max(
                1,
                Number(crush.level) || 1
            )
        );


    if(!crush.extraCluesByRound){

        crush.extraCluesByRound = {};

    }


    if(
        !Array.isArray(
            crush.extraCluesByRound[
                currentRound
            ]
        )
    ){

        crush.extraCluesByRound[
            currentRound
        ] = [];

    }


    const used =
        crush.extraCluesByRound[
            currentRound
        ];


    /*
     * Already used.
     */

    if(
        used.length >= 3
    ){

        closeSentCrushClueOverlay();

        alert(
            "You have already used all 3 additional clues for this round."
        );

        return;

    }


    /*
     * Do not allow the same slot to be unlocked twice.
     */

    if(
        used[index]
    ){

        return;

    }


    /*
     * Charge exactly 10 coins.
     */

    const paid =
        spendBankCoins(
            10,
            "Additional Crush Clue"
        );


    if(!paid){

        if(
            typeof openInsufficientCoinsModal ===
            "function"
        ){

            openInsufficientCoinsModal(
                10,
                () =>
                    unlockSentCrushClueSlot(
                        index
                    )
            );

        }else{

            alert(
                "You need 10 coins to add a clue."
            );

        }

        return;

    }


    /*
     * Refresh the slot list first.
     */

    renderSentCrushClueSlots();


    /*
     * Find the newly selected slot using its actual
     * data-clue-index instead of assuming that its
     * position in the DOM equals its clue number.
     */

    const slot =
        sentCrushClueSlots?.querySelector(
            `[data-clue-index="${index}"]`
        );


    if(!slot){

        return;

    }


    showUnlockedSentClueInput(
        index,
        slot
    );

}


/* =====================================================
UNLOCKED INPUT
===================================================== */

function showUnlockedSentClueInput(
    index,
    existingSlot = null
){

    const slot =
        existingSlot ||
        sentCrushClueSlots?.querySelector(
            `[data-clue-index="${index}"]`
        );


    if(!slot){

        return;

    }


    slot.className =
        "sent-crush-clue-slot";


    slot.dataset.clueIndex =
        index;


    slot.innerHTML = `

        <div
            class="sent-crush-clue-slot-header"
        >

            <span
                class="sent-crush-clue-slot-title"
            >
                ✦ Extra Clue ${index + 1}
            </span>


            <span
                class="sent-crush-clue-slot-price"
            >
                UNLOCKED
            </span>

        </div>


        <div
            class="sent-crush-clue-input-wrap"
        >

            <textarea
                class="sent-crush-clue-input"
                id="sent-crush-clue-input-${index}"
                maxlength="200"
                placeholder="Write the clue you want to send..."
            ></textarea>


            <button
                type="button"
                class="sent-crush-clue-send"
                data-send-extra-clue="${index}"
            >
                SEND CLUE
            </button>

        </div>

    `;


    const input =
        slot.querySelector(
            ".sent-crush-clue-input"
        );


    const sendButton =
        slot.querySelector(
            "[data-send-extra-clue]"
        );


    /*
     * IMPORTANT:
     *
     * Clicking inside the textarea must NOT trigger
     * the locked-slot purchase handler.
     */

    input?.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );


    input?.addEventListener(
        "pointerdown",
        event => {

            event.stopPropagation();

        }
    );


    sendButton?.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();


            sendSentCrushExtraClue(
                index
            );

        }
    );

}



/* =====================================================
SEND EXTRA CLUE
===================================================== */

function sendSentCrushExtraClue(
    index
){

    const crush =
        getSentCrushes()
            .find(
                item =>
                    item.id ===
                    activeSentCrushId
            );


    if(!crush){

        return;

    }


    const input =
        document.getElementById(
            `sent-crush-clue-input-${index}`
        );


    if(!input){

        return;

    }


    const text =
        input.value.trim();


    if(!text){

        alert(
            "Write your clue before sending it."
        );

        return;

    }


    const currentRound =
        Math.min(
            3,
            Math.max(
                1,
                Number(crush.level) || 1
            )
        );


    if(!crush.extraCluesByRound){

        crush.extraCluesByRound = {};

    }


    if(
        !Array.isArray(
            crush.extraCluesByRound[
                currentRound
            ]
        )
    ){

        crush.extraCluesByRound[
            currentRound
        ] = [];

    }


    const used =
        crush.extraCluesByRound[
            currentRound
        ];


    /*
     * Safety check.
     */

    if(
        used.length >= 3
    ){

        closeSentCrushClueOverlay();

        alert(
            "You have already used all 3 additional clues for this round."
        );

        return;

    }


    /*
     * Add the clue.
     */

    used.push(
        text
    );


    /*
     * Save the updated crush.
     */

    saveSentCrushData(
        crush
    );


    /*
     * Refresh the detail view.
     */

    renderSentCrushDetail(
        crush
    );


    const remaining =
        Math.max(
            0,
            3 - used.length
        );


    /*
     * ALL THREE USED.
     */

    if(!remaining){

        closeSentCrushClueOverlay();

        alert(
            "You have used all 3 additional clues for this round."
        );

        return;

    }


    /*
     * Some clues remain.
     *
     * Rebuild the overlay so the clue we just used
     * disappears and only the remaining slots stay.
     */

    renderSentCrushClueSlots();

}


/* =====================================================
SECRET NOTE
===================================================== */

function openSentCrushSecretNote(){

    alert(
        "The Secret Note composer will be connected in the next milestone."
    );

}


/* =====================================================
LIST ACTIONS
===================================================== */

function attachSentCrushListActions(){

    sentCrushList
        .querySelectorAll(
            "[data-chat-crush]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        const crush =
                            getSentCrushDisplayData()
                                .find(
                                    item =>
                                        item.id ===
                                        button.dataset.chatCrush
                                );


                        const target =
                            crush
                                ? getSentCrushTarget(
                                    crush
                                )
                                : null;


                        if(
                            target &&
                            typeof openChatThread ===
                            "function"
                        ){

                            closeSentCrushes();


                            setTimeout(
                                () => {

                                    openChatThread(
                                        target
                                    );

                                },
                                180
                            );

                        }

                    }
                );

            }
        );


    sentCrushList
        .querySelectorAll(
            "[data-gift-crush]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        alert(
                            "Gift sending will be connected to the Gift system."
                        );

                    }
                );

            }
        );

}


/* =====================================================
ACTIVITY HUB → SENT CRUSHES
===================================================== */

activityCards.forEach(
    card => {

        if(
            card.dataset.activity !==
            "sent-crushes"
        ){

            return;

        }


        card.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                closeActivityHub();


                setTimeout(
                    openSentCrushes,
                    180
                );

            }
        );

    }
);


/* =====================================================
DETAIL BUTTONS
===================================================== */

if(sentCrushDetailBack){

    sentCrushDetailBack.addEventListener(
        "click",
        closeSentCrushDetail
    );

}


if(sentCrushAddClue){

    sentCrushAddClue.addEventListener(
        "click",
        openSentCrushClueOverlay
    );

}


if(sentCrushSecretNote){

    sentCrushSecretNote.addEventListener(
        "click",
        openSentCrushSecretNote
    );

}


if(sentCrushClueClose){

    sentCrushClueClose.addEventListener(
        "click",
        closeSentCrushClueOverlay
    );

}


if(sentCrushClueOverlayBackdrop){

    sentCrushClueOverlayBackdrop.addEventListener(
        "click",
        closeSentCrushClueOverlay
    );

}


/* =====================================================
SLIDE DOTS
===================================================== */

function updateSentCrushSlideDots(){

    if(
        !sentCrushDetailTrack
    ){

        return;

    }


    const width =
        sentCrushDetailTrack
            .clientWidth;


    if(!width){

        return;

    }


    const index =
        Math.round(
            sentCrushDetailTrack.scrollLeft /
            width
        );


    document
        .querySelectorAll(
            "[data-slide-dot]"
        )
        .forEach(
            dot => {

                dot.classList.toggle(
                    "active",
                    Number(
                        dot.dataset.slideDot
                    ) === index
                );

            }
        );

}


if(sentCrushDetailTrack){

    sentCrushDetailTrack.addEventListener(
        "scroll",
        updateSentCrushSlideDots,
        {
            passive:true
        }
    );

}


document
    .querySelectorAll(
        "[data-slide-dot]"
    )
    .forEach(
        dot => {

            dot.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            dot.dataset.slideDot
                        );


                    sentCrushDetailTrack?.scrollTo({

                        left:
                            sentCrushDetailTrack.clientWidth *
                            index,

                        behavior:"smooth"

                    });

                }
            );

        }
    );


/* =====================================================
BACKDROP / ESCAPE
===================================================== */

if(sentCrushBack){

    sentCrushBack.addEventListener(
        "click",
        closeSentCrushes
    );

}


if(sentCrushBackdrop){

    sentCrushBackdrop.addEventListener(
        "click",
        closeSentCrushes
    );

}


document.addEventListener(
    "keydown",
    event => {

        if(
            event.key !==
            "Escape"
        ){

            return;

        }


        if(
            sentCrushClueOverlay &&
            sentCrushClueOverlay.classList.contains(
                "active"
            )
        ){

            closeSentCrushClueOverlay();

            return;

        }


        if(
            sentCrushDetailView &&
            sentCrushDetailView.classList.contains(
                "active"
            )
        ){

            closeSentCrushDetail();

            return;

        }


        if(
            sentCrushView &&
            sentCrushView.classList.contains(
                "active"
            )
        ){

            closeSentCrushes();

        }

    }
);

function unsendSentCrush(
    crushId
){

    const crush =
        getSentCrushes()
            .find(
                item =>
                    item.id ===
                    crushId
            );


    if(!crush){

        return;

    }


    const targetName =
        crush.targetSnapshot?.name ||
        crush.targetName ||
        "this person";


    const confirmed =
        confirm(
            `Unsend your crush to ${targetName}?\n\nIt will disappear from your Sent Crushes and the matching incoming side on this device.`
        );


    if(!confirmed){

        return;

    }


    let stored = [];


    try{

        stored =
            JSON.parse(
                localStorage.getItem(
                    SENT_CRUSH_STORAGE_KEY
                ) ||
                "[]"
            );

    }catch(error){

        stored = [];

    }


    if(!Array.isArray(stored)){

        stored = [];

    }


    /*
     * Remove the crush completely from the sender's
     * Sent Crush storage.
     */

    stored =
        stored.filter(
            item =>
                item.id !== crushId
        );


    localStorage.setItem(
        SENT_CRUSH_STORAGE_KEY,
        JSON.stringify(stored)
    );


    /*
     * Save a withdrawal marker so the matching
     * incoming demo crush can disappear too.
     */

    const withdrawn =
        getWithdrawnCrushRecords();


    const alreadyWithdrawn =
        withdrawn.some(
            record =>
                record.id === crushId
        );


    if(!alreadyWithdrawn){

        withdrawn.push({

            id:
                crushId,

            targetId:
                crush.targetId ||
                crush.targetSnapshot?.id ||
                "",

            targetName:
                crush.targetName ||
                crush.targetSnapshot?.name ||
                "",

            targetPostId:
                crush.targetPostId ||
                "",

            withdrawnAt:
                Date.now()

        });

    }


    localStorage.setItem(
        SENT_CRUSH_WITHDRAWN_KEY,
        JSON.stringify(withdrawn)
    );


    /*
     * Close detail/overlay if this was the crush
     * currently being viewed.
     */

    if(
        activeSentCrushId ===
        crushId
    ){

        closeSentCrushClueOverlay();
        closeSentCrushDetail();

    }


    /*
     * Refresh everything immediately.
     */

    renderSentCrushes();

    updateSentCrushCounts();


    if(
        typeof renderIncomingCrushes ===
        "function"
    ){

        renderIncomingCrushes();

    }


    alert(
        `Your crush to ${targetName} has been unsent.`
    );

}
/* =====================================================
SENT CRUSH — AUTHORITATIVE COUNTS
===================================================== */

function updateSentCrushCounts(){

    const crushes =
        getSentCrushes();


    const count =
        crushes.length;


    /*
     * ACTIVITY HUB SUMMARY
     */

    const summaryCount =
        document.querySelector(
            ".sent-crush-stat strong"
        );


    if(summaryCount){

        summaryCount.textContent =
            count;

    }


    /*
     * ACTIVITY HUB SENT CRUSH BADGE
     */

    const badge =
        document.querySelector(
            ".sent-crush-badge"
        );


    if(badge){

        badge.textContent =
            count;

    }


    /*
     * SENT CRUSH PAGE COUNT
     */

    if(sentCrushCount){

        sentCrushCount.textContent =
            count
                ? `${count} crush${count === 1 ? "" : "es"} sent`
                : "No crushes sent yet";

    }

}
/* =====================================================
MODULE: SECRET NOTES — COMPLETE INTERFACE ENGINE
===================================================== */

/*
 * IMPORTANT:
 *
 * Secret Notes sent from the existing send/reveal
 * engine already have:
 *
 * type: "note"
 * targetSnapshot
 * targetName
 * note
 * createdAt
 *
 * This module uses those records rather than creating
 * a separate sending system.
 */


/* =====================================================
STORAGE
===================================================== */

const SC_SECRET_NOTES_RECEIVED_KEY =
    "secretCrushReceivedSecretNotes";


const SC_SECRET_NOTES_READ_KEY =
    "secretCrushReadSecretNotes";


let activeSecretNoteId =
    null;


let activeSecretNoteMode =
    "received";


/* =====================================================
ELEMENTS
===================================================== */

const secretNotesView =
    document.getElementById(
        "secret-notes-view"
    );


const secretNotesBackdrop =
    document.getElementById(
        "secret-notes-backdrop"
    );


const secretNotesBack =
    document.getElementById(
        "secret-notes-back"
    );


const secretNotesPages =
    document.getElementById(
        "secret-notes-pages"
    );


const secretNoteOverlay =
    document.getElementById(
        "secret-note-overlay"
    );


const secretNoteOverlayBackdrop =
    document.getElementById(
        "secret-note-overlay-backdrop"
    );


const secretNoteModalClose =
    document.getElementById(
        "secret-note-modal-close"
    );


const secretNotePerson =
    document.getElementById(
        "secret-note-person"
    );


const secretNoteProfileInfo =
    document.getElementById(
        "secret-note-profile-info"
    );


const secretNoteMessage =
    document.getElementById(
        "secret-note-message"
    );
    
    const secretNoteScroll =
    document.querySelector(
        ".secret-note-scroll"
    );


const secretNoteExpandedOverlay =
    document.getElementById(
        "secret-note-expanded-overlay"
    );


const secretNoteExpandedBackdrop =
    document.getElementById(
        "secret-note-expanded-backdrop"
    );


const secretNoteExpandedClose =
    document.getElementById(
        "secret-note-expanded-close"
    );


const secretNoteExpandedMessage =
    document.getElementById(
        "secret-note-expanded-message"
    );


const secretNoteActions =
    document.getElementById(
        "secret-note-actions"
    );


const secretNoteEditButton =
    document.getElementById(
        "secret-note-edit-button"
    );


const secretNoteEditStatus =
    document.getElementById(
        "secret-note-edit-status"
    );


const secretNoteEditOverlay =
    document.getElementById(
        "secret-note-edit-overlay"
    );


const secretNoteEditBackdrop =
    document.getElementById(
        "secret-note-edit-backdrop"
    );


const secretNoteEditClose =
    document.getElementById(
        "secret-note-edit-close"
    );


const secretNoteEditInput =
    document.getElementById(
        "secret-note-edit-input"
    );


const secretNoteEditSave =
    document.getElementById(
        "secret-note-edit-save"
    );
    const secretNoteReplyArea =
    document.getElementById(
        "secret-note-reply-area"
    );


const secretNoteReplyInput =
    document.getElementById(
        "secret-note-reply-input"
    );


const secretNoteReplySend =
    document.getElementById(
        "secret-note-reply-send"
    );


const secretNoteReplyHistory =
    document.getElementById(
        "secret-note-reply-history"
    );


/* =====================================================
HELPERS
===================================================== */

function SC_SecretNotes_Read(){

    try{

        const saved =
            JSON.parse(
                localStorage.getItem(
                    SC_SECRET_NOTES_READ_KEY
                ) ||
                "[]"
            );


        return Array.isArray(saved)
            ? saved
            : [];

    }catch(error){

        return [];

    }

}


function SC_SecretNotes_SaveRead(
    ids
){

    localStorage.setItem(
        SC_SECRET_NOTES_READ_KEY,
        JSON.stringify(ids)
    );

}


function SC_SecretNotes_IsRead(
    id
){

    return SC_SecretNotes_Read()
        .includes(id);

}


function SC_SecretNotes_MarkRead(
    id
){

    const read =
        SC_SecretNotes_Read();


    if(!read.includes(id)){

        read.push(id);

        SC_SecretNotes_SaveRead(
            read
        );

    }

}


/* =====================================================
RECEIVED STORAGE
===================================================== */

function SC_SecretNotes_GetReceived(){

    try{

        const saved =
            JSON.parse(
                localStorage.getItem(
                    SC_SECRET_NOTES_RECEIVED_KEY
                ) ||
                "[]"
            );


        if(
            Array.isArray(saved)
        ){

            return saved;

        }

    }catch(error){

        console.error(
            "Unable to load received Secret Notes.",
            error
        );

    }


    return [];

}


function SC_SecretNotes_SaveReceived(
    notes
){

    localStorage.setItem(
        SC_SECRET_NOTES_RECEIVED_KEY,
        JSON.stringify(
            notes
        )
    );

}


/* =====================================================
PROFILE HELPERS
===================================================== */

function SC_SecretNotes_GetProfile(){

    try{

        return JSON.parse(
            localStorage.getItem(
                "secretCrushProfile"
            ) ||
            "{}"
        );

    }catch(error){

        return {};

    }

}


function SC_SecretNotes_Escape(
    value
){

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value == null
            ? ""
            : String(value);

    return div.innerHTML;

}


/* =====================================================
TARGET / PERSON DATA
===================================================== */

function SC_SecretNotes_GetPerson(
    note,
    direction
){

    if(direction === "sent"){

        return (
            note.targetSnapshot ||
            {
                name:
                    note.targetName ||
                    "Secret Crush",

                username:
                    "",

                photo:
                    "",

                school:
                    "",

                faculty:
                    "",

                year:
                    ""

            }
        );

    }


    return (
        note.senderSnapshot ||
        note.sender ||
        {

            name:
                note.senderName ||
                "Someone",

            username:
                note.senderUsername ||
                "",

            photo:
                note.senderPhoto ||
                "",

            school:
                note.senderSchool ||
                "",

            faculty:
                note.senderFaculty ||
                "",

            year:
                note.senderYear ||
                ""

        }
    );

}


/* =====================================================
REVEALED PROFILE INFORMATION

Nothing is rendered as "Hidden".

If a field wasn't revealed, it simply doesn't
appear.
===================================================== */

function SC_SecretNotes_GetRevealedFields(
    note
){

    if(
        Array.isArray(
            note.revealedFields
        )
    ){

        return note.revealedFields;

    }


    /*
     * Compatibility with the current send engine.
     *
     * Existing outgoing notes use selectedFields.
     */

    if(
        Array.isArray(
            note.selectedFields
        )
    ){

        return note.selectedFields;

    }


    return [

        "name",
        "username",
        "school",
        "faculty",
        "year",
        "photo"

    ];

}


/* =====================================================
RENDER PERSON
===================================================== */

function SC_SecretNotes_RenderPerson(
    person,
    mode
){

    const photo =
        person.photo ||
        person.profilePicture ||
        "";


    const name =
        person.name ||
        "Someone";


    const username =
        person.username ||
        "";


    const avatar =
        photo
            ? `
                <div class="secret-note-person-avatar">

                    <img
                        src="${SC_SecretNotes_Escape(photo)}"
                        alt=""
                    >

                </div>
            `
            : `
                <div
                    class="secret-note-person-avatar"
                    style="
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        color:#ad7aff;
                        font-size:22px;
                    "
                >
                    ♡
                </div>
            `;


    if(secretNotePerson){

        secretNotePerson.innerHTML = `

            ${avatar}

            <div class="secret-note-person-text">

                <strong>
                    ${SC_SecretNotes_Escape(name)}
                </strong>

                ${
                    username
                        ? `
                            <small>
                                ${SC_SecretNotes_Escape(
                                    username
                                )}
                            </small>
                        `
                        : `
                            <small>
                                ${
                                    mode === "sent"
                                        ? "Your secret note"
                                        : "Someone sent you a secret note"
                                }
                            </small>
                        `
                }

            </div>

        `;

    }

}


/* =====================================================
RENDER PROFILE INFORMATION
===================================================== */

function SC_SecretNotes_RenderProfileInfo(
    person,
    note,
    mode
){

    if(!secretNoteProfileInfo){

        return;

    }


    secretNoteProfileInfo.innerHTML = "";


    const fields =
        mode === "sent"
            ? [
                ["photo",""],
                ["username","Username"],
                ["school","School"],
                ["faculty","Faculty"],
                ["year","Year of study"]
            ]
            : [
                ["photo",""],
                ["username","Username"],
                ["school","School"],
                ["faculty","Faculty"],
                ["year","Year of study"]
            ];


    const revealed =
        SC_SecretNotes_GetRevealedFields(
            note
        );


    fields.forEach(
        ([field,label]) => {

            /*
             * Picture is already shown above.
             */

            if(field === "photo"){

                return;

            }


            /*
             * On SENT notes, show the full target
             * identity so the sender knows exactly
             * who received it.
             */

            if(
                mode !== "sent" &&
                !revealed.includes(field)
            ){

                return;

            }


            let value = "";


            if(field === "username"){

                value =
                    person.username ||
                    "";

            }


            if(field === "school"){

                value =
                    person.school ||
                    person.institution ||
                    "";

            }


            if(field === "faculty"){

                value =
                    person.faculty ||
                    "";

            }


            if(field === "year"){

                value =
                    person.year ||
                    "";

            }


            /*
             * If there is no value, don't display the
             * row at all.
             */

            if(!value){

                return;

            }


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "secret-note-profile-row";


            let icon =
                "•";


            if(field === "username"){

                icon = "@";

            }

            if(field === "school"){

                icon = "⌂";

            }

            if(field === "faculty"){

                icon = "◇";

            }

            if(field === "year"){

                icon = "◷";

            }


            row.innerHTML = `

                <span
                    class="secret-note-profile-icon"
                >
                    ${icon}
                </span>

                <span>
                    ${
                        mode === "sent"
                            ? SC_SecretNotes_Escape(value)
                            : `
                                ${SC_SecretNotes_Escape(
                                    value
                                )}
                            `
                    }
                </span>

            `;


            secretNoteProfileInfo.appendChild(
                row
            );

        }
    );

}


/* =====================================================
GET SENT NOTES

Uses the EXISTING sent-item storage.
===================================================== */

function SC_SecretNotes_GetSent(){

    let items = [];


    try{

        items =
            JSON.parse(
                localStorage.getItem(
                    typeof SENT_CRUSH_STORAGE_KEY !==
                    "undefined"
                        ? SENT_CRUSH_STORAGE_KEY
                        : "secretCrushSentItems"
                ) ||
                "[]"
            );

    }catch(error){

        items = [];

    }


    if(!Array.isArray(items)){

        return [];

    }


    return items
        .filter(
            item =>
                item &&
                item.type === "note" &&
                item.status !== "Unsent"
        )
        .sort(
            (a,b) =>
                Number(b.createdAt || 0) -
                Number(a.createdAt || 0)
        );

}


/* =====================================================
SORT RECEIVED

Unread first.

Within each group, newest first.
===================================================== */

function SC_SecretNotes_SortReceived(
    notes
){

    return [
        ...notes
    ].sort(
        (a,b) => {

            const aRead =
                SC_SecretNotes_IsRead(
                    a.id
                );


            const bRead =
                SC_SecretNotes_IsRead(
                    b.id
                );


            if(aRead !== bRead){

                return aRead
                    ? 1
                    : -1;

            }


            return (
                Number(
                    b.receivedAt ||
                    b.createdAt ||
                    0
                )
                -
                Number(
                    a.receivedAt ||
                    a.createdAt ||
                    0
                )
            );

        }
    );

}


/* =====================================================
DATE FORMAT
===================================================== */

function SC_SecretNotes_FormatDate(
    timestamp
){

    if(!timestamp){

        return "";

    }


    const date =
        new Date(
            Number(timestamp)
        );


    if(
        Number.isNaN(
            date.getTime()
        )
    ){

        return "";

    }


    return date.toLocaleString(
        [],
        {
            day:"numeric",
            month:"short",
            hour:"numeric",
            minute:"2-digit"
        }
    );

}


/* =====================================================
RENDER RECEIVED CARDS
===================================================== */

function SC_SecretNotes_RenderReceived(){

    const list =
        document.getElementById(
            "secret-notes-received-list"
        );


    const empty =
        document.getElementById(
            "secret-notes-received-empty"
        );


    if(!list){

        return;

    }


    const notes =
        SC_SecretNotes_SortReceived(
            SC_SecretNotes_GetReceived()
        );


    list.innerHTML = "";


    if(
        !notes.length
    ){

        if(empty){

            empty.hidden = false;

        }

        return;

    }


    if(empty){

        empty.hidden = true;

    }


    notes.forEach(
        note => {

            const person =
                SC_SecretNotes_GetPerson(
                    note,
                    "received"
                );


            const read =
                SC_SecretNotes_IsRead(
                    note.id
                );


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "secret-note-card" +
                (
                    read
                        ? ""
                        : " unread"
                );


            card.dataset.noteId =
                note.id;


            const photo =
                person.photo ||
                person.profilePicture ||
                "";


            const avatar =
                photo
                    ? `
                        <img
                            src="${SC_SecretNotes_Escape(photo)}"
                            alt=""
                        >
                    `
                    : "✉️";


            const preview =
                note.note ||
                "A secret note is waiting for you...";


            card.innerHTML = `

                <div
                    class="secret-note-card-avatar"
                >
                    ${avatar}
                </div>


                <div
                    class="secret-note-card-content"
                >

                    <div
                        class="secret-note-card-name"
                    >

                        ${SC_SecretNotes_Escape(
                            person.name ||
                            "Someone"
                        )}

                    </div>


                    <span
                        class="secret-note-card-preview"
                    >
                        ${SC_SecretNotes_Escape(
                            preview
                        )}
                    </span>


                    <span
                        class="secret-note-card-time"
                    >
                        ${SC_SecretNotes_FormatDate(
                            note.receivedAt ||
                            note.createdAt
                        )}
                    </span>

                </div>


                <div
                    class="secret-note-card-right"
                >

                    <span
                        class="secret-note-envelope"
                    >
                        ${
                            read
                                ? "✉"
                                : "🔒"
                        }
                    </span>


                    ${
                        read
                            ? `
                                <span
                                    class="secret-note-read-label"
                                >
                                    Read
                                </span>
                            `
                            : `
                                <span
                                    class="secret-note-unread-dot"
                                ></span>
                            `
                    }

                </div>

            `;


            card.addEventListener(
                "click",
                () => {

                    SC_SecretNotes_OpenNote(
                        note.id,
                        "received"
                    );

                }
            );


            list.appendChild(
                card
            );

        }
    );

}


/* =====================================================
RENDER SENT CARDS
===================================================== */

function SC_SecretNotes_RenderSent(){

    const list =
        document.getElementById(
            "secret-notes-sent-list"
        );


    const empty =
        document.getElementById(
            "secret-notes-sent-empty"
        );


    if(!list){

        return;

    }


    const notes =
        SC_SecretNotes_GetSent();


    list.innerHTML = "";


    if(!notes.length){

        if(empty){

            empty.hidden = false;

        }

        return;

    }


    if(empty){

        empty.hidden = true;

    }


    notes.forEach(
        note => {

            const person =
                SC_SecretNotes_GetPerson(
                    note,
                    "sent"
                );


            const read =
                !!(
                    note.read === true ||
                    note.opened === true ||
                    note.recipientOpened === true
                );


            const photo =
                person.photo ||
                person.profilePicture ||
                "";


            const avatar =
                photo
                    ? `
                        <img
                            src="${SC_SecretNotes_Escape(photo)}"
                            alt=""
                        >
                    `
                    : "♡";


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "secret-note-card";


            card.dataset.noteId =
                note.id;


            card.innerHTML = `

                <div
                    class="secret-note-card-avatar"
                >
                    ${avatar}
                </div>


                <div
                    class="secret-note-card-content"
                >

                    <div
                        class="secret-note-card-name"
                    >

                        ${SC_SecretNotes_Escape(
                            person.name ||
                            note.targetName ||
                            "Someone"
                        )}

                    </div>


                    <span
                        class="secret-note-card-preview"
                    >
                        ${SC_SecretNotes_Escape(
                            note.note ||
                            ""
                        )}
                    </span>


                    <span
                        class="
                            secret-note-sent-status
                            ${read ? "read" : ""}
                        "
                    >
                        ${
                            read
                                ? "Opened by recipient"
                                : "Not opened yet"
                        }
                    </span>

                </div>


                <div
                    class="secret-note-card-right"
                >

                    <span
                        class="secret-note-card-time"
                    >
                        ${SC_SecretNotes_FormatDate(
                            note.createdAt
                        )}
                    </span>


                    <button
                        type="button"
                        class="
                            secret-note-delete
                            ${
                                read
                                    ? ""
                                    : "can-unsend"
                            }
                        "
                        ${
                            read
                                ? "disabled"
                                : ""
                        }
                        title="${
                            read
                                ? "This note has already been opened"
                                : "Unsend note"
                        }"
                    >
                        🗑
                    </button>

                </div>

            `;


            /*
             * Clicking the card opens the note.
             */

            

            /*
             * Trash button.
             */

            const deleteButton =
                card.querySelector(
                    ".secret-note-delete"
                );


            if(deleteButton){

                deleteButton.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();
                        event.stopPropagation();


                        if(read){

                            alert(
                                "This secret note has already been opened, so it can no longer be unsent."
                            );

                            return;

                        }


                        SC_SecretNotes_Unsend(
                            note.id
                        );

                    }
                );

            }


            list.appendChild(
                card
            );

        }
    );

}


/* =====================================================
COUNTS
===================================================== */

function SC_SecretNotes_UpdateCounts(){

    const received =
        SC_SecretNotes_GetReceived();


    const sent =
        SC_SecretNotes_GetSent();


    const unread =
        received.filter(
            note =>
                !SC_SecretNotes_IsRead(
                    note.id
                )
        ).length;


    const receivedCount =
        document.getElementById(
            "secret-notes-received-count"
        );


    const sentCount =
        document.getElementById(
            "secret-notes-sent-count"
        );


    if(receivedCount){

        receivedCount.textContent =
            unread;

    }


    if(sentCount){

        sentCount.textContent =
            sent.length;

    }


    /*
     * Also update the existing Activity Hub
     * Secret Notes badge.
     */

document.querySelectorAll(
        ".note-badge"
    ).forEach(
        badge => {

            badge.textContent =
                unread;

        }
    );

    const noteSummary =
        document.querySelector(
            ".note-stat strong"
        );

    if(noteSummary){

        noteSummary.textContent =
            unread;

    }

}


/* =====================================================
RENDER EVERYTHING
===================================================== */

function SC_SecretNotes_Render(){

    SC_SecretNotes_RenderReceived();

    SC_SecretNotes_RenderSent();

    SC_SecretNotes_UpdateCounts();

}


/* =====================================================
OPEN SECRET NOTES PAGE
===================================================== */

function openSecretNotes(){

    if(!secretNotesView){

        return;

    }


    SC_SecretNotes_Render();


    secretNotesView.classList.add(
        "active"
    );


    secretNotesView.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "secret-notes-open"
    );


    /*
     * Always start on Received.
     */

    SC_SecretNotes_SetTab(
        "received",
        false
    );

}


/* =====================================================
CLOSE SECRET NOTES PAGE
===================================================== */

function closeSecretNotes(){

    if(!secretNotesView){

        return;

    }


    SC_SecretNotes_CloseNote();

    SC_SecretNotes_CloseEditor();


    secretNotesView.classList.remove(
        "active"
    );


    secretNotesView.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "secret-notes-open"
    );


    openActivityHub();

}


/* =====================================================
TAB SWITCHING
===================================================== */

function SC_SecretNotes_SetTab(
    tab,
    updateScroll = true
){

    const buttons =
        document.querySelectorAll(
            "[data-notes-tab]"
        );


    const pages =
        document.querySelectorAll(
            "[data-notes-page]"
        );


    buttons.forEach(
        button => {

            button.classList.toggle(
                "active",
                button.dataset.notesTab ===
                tab
            );

        }
    );


    pages.forEach(
        page => {

            page.classList.toggle(
                "active",
                page.dataset.notesPage ===
                tab
            );

        }
    );


    if(
        updateScroll &&
        secretNotesPages
    ){

        secretNotesPages.scrollTo({

            left:
                tab === "sent"
                    ? secretNotesPages.clientWidth
                    : 0,

            behavior:
                "smooth"

        });

    }

}


/* =====================================================
OPEN NOTE
===================================================== */

function SC_SecretNotes_OpenNote(
    noteId,
    mode
){

    const notes =
        mode === "sent"
            ? SC_SecretNotes_GetSent()
            : SC_SecretNotes_GetReceived();


    const note =
        notes.find(
            item =>
                item.id ===
                noteId
        );


    if(!note){

        return;

    }


    activeSecretNoteId =
        noteId;


    activeSecretNoteMode =
        mode;


    const person =
        SC_SecretNotes_GetPerson(
            note,
            mode
        );


    /*
     * RECEIVED:
     *
     * Opening marks the note as read.
     */

    if(mode === "received"){

        SC_SecretNotes_MarkRead(
            noteId
        );


        /*
         * Also mark the stored received record.
         */

        const received =
            SC_SecretNotes_GetReceived();


        const stored =
            received.find(
                item =>
                    item.id ===
                    noteId
            );


        if(stored){

            stored.read =
                true;

            stored.openedAt =
                Date.now();

            SC_SecretNotes_SaveReceived(
                received
            );

        }


        SC_SecretNotes_RenderReceived();

        SC_SecretNotes_UpdateCounts();

    }


    SC_SecretNotes_RenderPerson(
        person,
        mode
    );


    SC_SecretNotes_RenderProfileInfo(
        person,
        note,
        mode
    );


    if(secretNoteMessage){

        secretNoteMessage.textContent =
            note.note ||
            "";

    }
SC_SecretNotes_RenderReplies(
    note,
    mode
);

    /*
     * SENT NOTE ACTIONS
     */

    if(
        secretNoteActions
    ){

        secretNoteActions.hidden =
            mode !== "sent";

    }


    if(mode === "sent"){

        const read =
            !!(
                note.read === true ||
                note.opened === true ||
                note.recipientOpened === true
            );


        if(secretNoteEditButton){

            secretNoteEditButton.disabled =
                read;

        }


        if(secretNoteEditStatus){

            secretNoteEditStatus.textContent =
                read
                    ? "This note has already been opened and can no longer be edited."
                    : "You can edit this note until the recipient opens it.";

        }

    }


    if(secretNoteOverlay){

        secretNoteOverlay.classList.add(
            "active"
        );


        secretNoteOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

    }

}


/* =====================================================
CLOSE NOTE
===================================================== */

function SC_SecretNotes_CloseNote(){

    activeSecretNoteId =
        null;


    if(secretNoteOverlay){

        secretNoteOverlay.classList.remove(
            "active"
        );


        secretNoteOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

    }

}


/* =====================================================
EDIT NOTE
===================================================== */

function SC_SecretNotes_OpenEditor(){

    if(
        !activeSecretNoteId ||
        activeSecretNoteMode !== "sent"
    ){

        return;

    }


    const note =
        SC_SecretNotes_GetSent()
            .find(
                item =>
                    item.id ===
                    activeSecretNoteId
            );


    if(!note){

        return;

    }


    const read =
        !!(
            note.read === true ||
            note.opened === true ||
            note.recipientOpened === true
        );


    if(read){

        alert(
            "This secret note has already been opened, so it can no longer be edited."
        );

        return;

    }


    if(secretNoteEditInput){

        secretNoteEditInput.value =
            note.note ||
            "";

    }


    if(secretNoteEditOverlay){

        secretNoteEditOverlay.classList.add(
            "active"
        );


        secretNoteEditOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

    }

}


/* =====================================================
CLOSE EDITOR
===================================================== */

function SC_SecretNotes_CloseEditor(){

    if(secretNoteEditOverlay){

        secretNoteEditOverlay.classList.remove(
            "active"
        );


        secretNoteEditOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

    }

}

/* =====================================================
SECRET NOTE — REPLIES
===================================================== */

function SC_SecretNotes_RenderReplies(
    note,
    mode
){

    if(!secretNoteReplyArea){
        return;
    }


    const replies =
        Array.isArray(
            note?.replies
        )
            ? note.replies
            : [];


    secretNoteReplyArea.hidden =
        mode !== "received" &&
        replies.length === 0;


    if(secretNoteReplyHistory){

        secretNoteReplyHistory.innerHTML =
            replies
                .map(
                    reply => `

                        <div
                            class="secret-note-reply-bubble"
                        >

                            <strong>
                                ${escapePostHTML(
                                    reply.senderName ||
                                    "Reply"
                                )}
                            </strong>

                            <p>
                                ${escapePostHTML(
                                    reply.text ||
                                    ""
                                )}
                            </p>

                        </div>

                    `
                )
                .join("");

    }


    if(secretNoteReplyInput){

        secretNoteReplyInput.value =
            "";

        secretNoteReplyInput.hidden =
            mode !== "received";

    }


    if(secretNoteReplySend){

        secretNoteReplySend.hidden =
            mode !== "received";

    }


    if(
        mode === "received" &&
        !replies.length
    ){

        secretNoteReplyArea.hidden =
            false;

    }

}


function SC_SecretNotes_SendReply(){

    if(
        !activeSecretNoteId ||
        activeSecretNoteMode !== "received" ||
        !secretNoteReplyInput
    ){

        return;

    }


    const text =
        secretNoteReplyInput.value.trim();


    if(!text){
        return;
    }


    const received =
        SC_SecretNotes_GetReceived();


    const note =
        received.find(
            item =>
                item.id ===
                activeSecretNoteId
        );


    if(!note){
        return;
    }


    if(
        !Array.isArray(
            note.replies
        )
    ){

        note.replies = [];

    }


    const profile =
        SC_SecretNotes_GetProfile();


    const reply = {

        id:
            "note-reply-" +
            Date.now(),

        text:
            text,

        createdAt:
            Date.now(),

        read:
            true,

        senderName:
            profile.name ||
            "You",

        senderUsername:
            profile.username ||
            "",

        senderSnapshot:{

            id:
                profile.id ||
                "current-user",

            name:
                profile.name ||
                "You",

            username:
                profile.username ||
                "",

            photo:
                profile.profilePicture ||
                profile.photo ||
                ""

        }

    };


    note.replies.push(
        reply
    );


    SC_SecretNotes_SaveReceived(
        received
    );


    /*
     * Local demo bridge.
     * The real backend will eventually deliver
     * this reply to the sender.
     */

    let sent = [];


    try{

        sent =
            JSON.parse(
                localStorage.getItem(
                    typeof SENT_CRUSH_STORAGE_KEY !==
                    "undefined"

                        ? SENT_CRUSH_STORAGE_KEY

                        : "secretCrushSentItems"
                ) ||
                "[]"
            );

    }catch(error){

        sent = [];

    }


    const original =
        sent.find(
            item =>
                item.type === "note" &&
                (
                    item.id ===
                    note.sourceId ||

                    item.id ===
                    note.id
                )
        );


    if(original){

        if(
            !Array.isArray(
                original.replies
            )
        ){

            original.replies = [];

        }


        original.replies.push(
            reply
        );


        localStorage.setItem(

            typeof SENT_CRUSH_STORAGE_KEY !==
            "undefined"

                ? SENT_CRUSH_STORAGE_KEY

                : "secretCrushSentItems",

            JSON.stringify(
                sent
            )

        );

    }


    secretNoteReplyInput.value =
        "";


    SC_SecretNotes_RenderReplies(
        note,
        "received"
    );


    SC_OtherActivity_Render();

}


function SC_ReceiveSecretNoteReply(
    data
){

    if(!data){
        return null;
    }


    const noteId =
        data.noteId ||
        data.sourceId;


    if(!noteId){
        return null;
    }


    let sent = [];


    try{

        sent =
            JSON.parse(
                localStorage.getItem(
                    typeof SENT_CRUSH_STORAGE_KEY !==
                    "undefined"

                        ? SENT_CRUSH_STORAGE_KEY

                        : "secretCrushSentItems"
                ) ||
                "[]"
            );

    }catch(error){

        sent = [];

    }


    const note =
        sent.find(
            item =>
                item.type ===
                "note" &&
                item.id ===
                noteId
        );


    if(!note){
        return null;
    }


    if(
        !Array.isArray(
            note.replies
        )
    ){

        note.replies = [];

    }


    const reply = {

        id:
            data.id ||
            "note-reply-" +
            Date.now(),

        text:
            data.text ||
            "",

        createdAt:
            Number(
                data.createdAt
            ) ||
            Date.now(),

        read:
            false,

        senderName:
            data.senderName ||
            data.senderSnapshot?.name ||
            "Someone",

        senderUsername:
            data.senderUsername ||
            data.senderSnapshot?.username ||
            "",

        senderSnapshot:
            data.senderSnapshot ||
            {}

    };


    if(
        note.replies.some(
            item =>
                item.id ===
                reply.id
        )
    ){

        return reply;

    }


    note.replies.push(
        reply
    );


    localStorage.setItem(

        typeof SENT_CRUSH_STORAGE_KEY !==
        "undefined"

            ? SENT_CRUSH_STORAGE_KEY

            : "secretCrushSentItems",

        JSON.stringify(
            sent
        )

    );


    SC_OtherActivity_Add({

        id:
            "secret-note-reply-" +
            reply.id,

        actorId:
            data.senderId ||
            data.senderSnapshot?.id ||
            data.senderUsername ||
            "reply-sender-" +
            note.id,

        actorSnapshot:
            data.senderSnapshot ||
            {},

        type:
            "secret_note_reply",

        title:
            `${reply.senderName || "Someone"} replied to your note`,

        description:
            "Tap to open the reply.",

        timestamp:
            reply.createdAt,

        read:
            false,

        route:{

            type:
                "secret-note-reply",

            noteId:
                note.id,

            mode:
                "sent"

        }

    });


    if(
        secretNotesView?.classList.contains(
            "active"
        )
    ){

        SC_SecretNotes_Render();

    }


    return reply;

}
/* =====================================================
   EXPANDED SECRET NOTE
   ===================================================== */

function SC_SecretNotes_OpenExpandedNote(){

    /*
     * There must be an active note first.
     */

    if(
        !activeSecretNoteId ||
        !activeSecretNoteMode
    ){

        return;

    }


    const notes =
        activeSecretNoteMode === "sent"
            ? SC_SecretNotes_GetSent()
            : SC_SecretNotes_GetReceived();


    const note =
        notes.find(
            item =>
                item.id ===
                activeSecretNoteId
        );


    if(!note){

        return;

    }


    /*
     * Put the actual note content
     * into the large reading view.
     */

    if(secretNoteExpandedMessage){

        secretNoteExpandedMessage.textContent =
            note.note ||
            "";

    }


    /*
     * Open the expanded overlay.
     */

    if(secretNoteExpandedOverlay){

        secretNoteExpandedOverlay.classList.add(
            "active"
        );


        secretNoteExpandedOverlay.setAttribute(
            "aria-hidden",
            "false"
        );


        /*
         * Start at the beginning of
         * a long note.
         */

        const paper =
            document.getElementById(
                "secret-note-expanded-paper"
            );


        if(paper){

            paper.scrollTop = 0;

        }

    }

}


/* =====================================================
   CLOSE EXPANDED SECRET NOTE
   ===================================================== */

function SC_SecretNotes_CloseExpandedNote(){

    if(secretNoteExpandedOverlay){

        secretNoteExpandedOverlay.classList.remove(
            "active"
        );


        secretNoteExpandedOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

    }

}

/* =====================================================
SAVE EDITED NOTE
===================================================== */

function SC_SecretNotes_SaveEdit(){

    if(!activeSecretNoteId){

        return;

    }


    const text =
        secretNoteEditInput?.value.trim() ||
        "";


    if(!text){

        alert(
            "Your secret note cannot be empty."
        );

        return;

    }


    let items = [];


    try{

        items =
            JSON.parse(
                localStorage.getItem(
                    typeof SENT_CRUSH_STORAGE_KEY !==
                    "undefined"
                        ? SENT_CRUSH_STORAGE_KEY
                        : "secretCrushSentItems"
                ) ||
                "[]"
            );

    }catch(error){

        items = [];

    }


    const note =
        items.find(
            item =>
                item.id ===
                activeSecretNoteId &&
                item.type === "note"
        );


    if(!note){

        return;

    }


    const read =
        !!(
            note.read === true ||
            note.opened === true ||
            note.recipientOpened === true
        );


    if(read){

        alert(
            "This secret note has already been opened, so it can no longer be edited."
        );

        SC_SecretNotes_CloseEditor();

        return;

    }


    note.note =
        text;


    note.updatedAt =
        Date.now();


    localStorage.setItem(
        typeof SENT_CRUSH_STORAGE_KEY !==
        "undefined"
            ? SENT_CRUSH_STORAGE_KEY
            : "secretCrushSentItems",
        JSON.stringify(
            items
        )
    );


    SC_SecretNotes_CloseEditor();


    SC_SecretNotes_RenderSent();


    /*
     * Refresh the open note.
     */

    SC_SecretNotes_OpenNote(
        activeSecretNoteId,
        "sent"
    );

}


/* =====================================================
UNSEND NOTE
===================================================== */

function SC_SecretNotes_Unsend(
    noteId
){

    let items = [];


    try{

        items =
            JSON.parse(
                localStorage.getItem(
                    typeof SENT_CRUSH_STORAGE_KEY !==
                    "undefined"
                        ? SENT_CRUSH_STORAGE_KEY
                        : "secretCrushSentItems"
                ) ||
                "[]"
            );

    }catch(error){

        items = [];

    }


    const note =
        items.find(
            item =>
                item.id ===
                noteId &&
                item.type === "note"
        );


    if(!note){

        return;

    }


    const read =
        !!(
            note.read === true ||
            note.opened === true ||
            note.recipientOpened === true
        );


    if(read){

        alert(
            "This secret note has already been opened, so it can no longer be unsent."
        );

        return;

    }


    const target =
        note.targetName ||
        note.targetSnapshot?.name ||
        "this person";


    const confirmed =
        confirm(
            `Unsend your secret note to ${target}?`
        );


    if(!confirmed){

        return;

    }


    /*
     * Remove from existing Sent storage.
     */

    items =
        items.filter(
            item =>
                item.id !== noteId
        );


    localStorage.setItem(
        typeof SENT_CRUSH_STORAGE_KEY !==
        "undefined"
            ? SENT_CRUSH_STORAGE_KEY
            : "secretCrushSentItems",
        JSON.stringify(
            items
        )
    );


    /*
     * If a matching received record exists on the
     * local/demo side, remove it too.
     */

    let received =
        SC_SecretNotes_GetReceived();


    received =
        received.filter(
            item =>
                item.id !== noteId &&
                item.sourceId !== noteId
        );


    SC_SecretNotes_SaveReceived(
        received
    );


    SC_SecretNotes_CloseNote();


    SC_SecretNotes_Render();


    alert(
        "Your secret note has been unsent."
    );

}


/* =====================================================
RECEIVE SECRET NOTE

THIS is the receiving-side API for the current
Secret Crush engine.

A future backend can call this exact function when
a real recipient receives a note.
===================================================== */

function SC_ReceiveSecretNote(
    data
){

    if(!data){

        return null;

    }


    const note = {

        id:
            data.id ||
            "received-note-" +
            Date.now(),

        sourceId:
            data.sourceId ||
            data.id ||
            "",

        senderSnapshot:
            data.senderSnapshot ||
            data.sender ||
            {},

        senderName:
            data.senderName ||
            data.senderSnapshot?.name ||
            "Someone",

        senderUsername:
            data.senderUsername ||
            data.senderSnapshot?.username ||
            "",

        senderPhoto:
            data.senderPhoto ||
            data.senderSnapshot?.photo ||
            "",

        senderSchool:
            data.senderSchool ||
            data.senderSnapshot?.school ||
            "",

        senderFaculty:
            data.senderFaculty ||
            data.senderSnapshot?.faculty ||
            "",

        senderYear:
            data.senderYear ||
            data.senderSnapshot?.year ||
            "",

        revealedFields:
            Array.isArray(
                data.revealedFields
            )
                ? [
                    ...data.revealedFields
                ]
                : [],

        note:
            data.note ||
            "",

        read:
            false,

        createdAt:
            data.createdAt ||
            Date.now(),

        receivedAt:
            Date.now()

    };


    const existing =
        SC_SecretNotes_GetReceived();


    /*
     * Don't duplicate the same note.
     */

    const alreadyExists =
        existing.some(
            item =>
                item.id ===
                note.id
        );


    if(alreadyExists){

        return note;

    }


    existing.unshift(
        note
    );


    SC_SecretNotes_SaveReceived(
        existing
    );


    /*
     * Update the user's profile statistic.
     */

    try{

        const profile =
            SC_SecretNotes_GetProfile();


        profile.secretNotesReceived =
            Number(
                profile.secretNotesReceived ||
                0
            ) + 1;


        localStorage.setItem(
            "secretCrushProfile",
            JSON.stringify(
                profile
            )
        );

    }catch(error){

        console.warn(
            "Unable to update note count.",
            error
        );

    }


    SC_SecretNotes_Render();


    return note;

}


/* =====================================================
CONNECT EXISTING SEND ENGINE
===================================================== */

/*
 * The existing application already calls
 *
 * saveSentCrushOrNote(sentItem)
 *
 * when a Secret Note is sent.
 *
 * We wrap that function rather than replacing it.
 */

if(
    typeof saveSentCrushOrNote ===
    "function" &&
    !window.__secretNotesSaveWrapped
){

    const SC_OriginalSaveSentCrushOrNote =
        saveSentCrushOrNote;


    window.__secretNotesSaveWrapped =
        true;


    saveSentCrushOrNote =
        function(
            item
        ){

            /*
             * Preserve all existing behaviour.
             */

            SC_OriginalSaveSentCrushOrNote(
                item
            );


            /*
             * Add note-specific fields only to
             * Secret Notes.
             */

            if(
                item &&
                item.type === "note"
            ){

                let items = [];


                try{

                    items =
                        JSON.parse(
                            localStorage.getItem(
                                typeof SENT_CRUSH_STORAGE_KEY !==
                                "undefined"
                                    ? SENT_CRUSH_STORAGE_KEY
                                    : "secretCrushSentItems"
                            ) ||
                            "[]"
                        );

                }catch(error){

                    items = [];

                }


                const stored =
                    items.find(
                        saved =>
                            saved.id ===
                            item.id
                    );


                if(stored){

                    stored.read =
                        false;

                    stored.opened =
                        false;

                    stored.recipientOpened =
                        false;

                    stored.sentAt =
                        stored.createdAt ||
                        Date.now();


                    if(
                        !stored.targetSnapshot
                    ){

                        stored.targetSnapshot =
                            item.targetSnapshot ||
                            {};

                    }


                    localStorage.setItem(
                        typeof SENT_CRUSH_STORAGE_KEY !==
                        "undefined"
                            ? SENT_CRUSH_STORAGE_KEY
                            : "secretCrushSentItems",
                        JSON.stringify(
                            items
                        )
                    );

                }

            }


            /*
             * Refresh Secret Notes if the interface
             * is already open.
             */

            if(
                secretNotesView &&
                secretNotesView.classList.contains(
                    "active"
                )
            ){

                SC_SecretNotes_Render();

            }

        };

}


/* =====================================================
ACTIVITY HUB → SECRET NOTES
===================================================== */

if(
    typeof activityCards !==
    "undefined"
){

    activityCards.forEach(
        card => {

            if(
                card.dataset.activity !==
                "secret-notes"
            ){

                return;

            }


            card.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    closeActivityHub();


                    setTimeout(
                        openSecretNotes,
                        180
                    );

                }
            );

        }
    );

}


/* =====================================================
TAB BUTTONS
===================================================== */

document
    .querySelectorAll(
        "[data-notes-tab]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    SC_SecretNotes_SetTab(
                        button.dataset.notesTab
                    );

                }
            );

        }
    );


/* =====================================================
SWIPE POSITION → ACTIVE TAB
===================================================== */

if(secretNotesPages){

    secretNotesPages.addEventListener(
        "scroll",
        () => {

            const width =
                secretNotesPages.clientWidth;


            if(!width){

                return;

            }


            const index =
                Math.round(
                    secretNotesPages.scrollLeft /
                    width
                );


            SC_SecretNotes_SetTab(
                index === 1
                    ? "sent"
                    : "received",
                false
            );

        },
        {
            passive:true
        }
    );

}


/* =====================================================
BACK BUTTON
===================================================== */

if(secretNotesBack){

    secretNotesBack.addEventListener(
        "click",
        closeSecretNotes
    );

}


/* =====================================================
BACKDROP
===================================================== */

if(secretNotesBackdrop){

    secretNotesBackdrop.addEventListener(
        "click",
        closeSecretNotes
    );

}


/* =====================================================
NOTE OVERLAY CLOSE
===================================================== */

if(secretNoteModalClose){

    secretNoteModalClose.addEventListener(
        "click",
        SC_SecretNotes_CloseNote
    );

}


if(secretNoteOverlayBackdrop){

    secretNoteOverlayBackdrop.addEventListener(
        "click",
        SC_SecretNotes_CloseNote
    );

}


/* =====================================================
   EXPAND NOTE WHEN NOTE PAPER IS TAPPED
   ===================================================== */

if(secretNoteScroll){

    secretNoteScroll.addEventListener(
        "click",
        event => {

            /*
             * Only the note itself should
             * trigger the expanded view.
             */

            if(
                event.target.closest(
                    ".secret-note-message"
                ) ||
                event.target.closest(
                    ".secret-note-scroll-top"
                ) ||
                event.target.closest(
                    ".secret-note-scroll-bottom"
                )
            ){

                SC_SecretNotes_OpenExpandedNote();

            }

        }
    );

}

/* =====================================================
   EXPANDED NOTE CLOSE
   ===================================================== */

if(secretNoteExpandedClose){

    secretNoteExpandedClose.addEventListener(
        "click",
        SC_SecretNotes_CloseExpandedNote
    );

}


if(secretNoteExpandedBackdrop){

    secretNoteExpandedBackdrop.addEventListener(
        "click",
        SC_SecretNotes_CloseExpandedNote
    );

}

/* =====================================================
EDIT
===================================================== */

if(secretNoteEditButton){

    secretNoteEditButton.addEventListener(
        "click",
        SC_SecretNotes_OpenEditor
    );

}


if(secretNoteEditClose){

    secretNoteEditClose.addEventListener(
        "click",
        SC_SecretNotes_CloseEditor
    );

}


if(secretNoteEditBackdrop){

    secretNoteEditBackdrop.addEventListener(
        "click",
        SC_SecretNotes_CloseEditor
    );

}


if(secretNoteEditSave){

    secretNoteEditSave.addEventListener(
        "click",
        SC_SecretNotes_SaveEdit
    );

}
if(secretNoteReplySend){

    secretNoteReplySend.addEventListener(
        "click",
        SC_SecretNotes_SendReply
    );

}

/* =====================================================
ESCAPE KEY
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if(
            event.key !== "Escape"
        ){

            return;

        }
        
        if(
    secretNoteExpandedOverlay &&
    secretNoteExpandedOverlay.classList.contains(
        "active"
    )
){

    SC_SecretNotes_CloseExpandedNote();

    return;

}


        if(
            secretNoteEditOverlay &&
            secretNoteEditOverlay.classList.contains(
                "active"
            )
        ){

            SC_SecretNotes_CloseEditor();

            return;

        }


        if(
            secretNoteOverlay &&
            secretNoteOverlay.classList.contains(
                "active"
            )
        ){

            SC_SecretNotes_CloseNote();

            return;

        }


        if(
            secretNotesView &&
            secretNotesView.classList.contains(
                "active"
            )
        ){

            closeSecretNotes();

        }

    }
);



/* =====================================================
   SENT NOTE CARD CLICK HANDLER
   ===================================================== */

const secretNotesSentList =
    document.getElementById(
        "secret-notes-sent-list"
    );


if(secretNotesSentList){

    secretNotesSentList.addEventListener(
        "click",
        event => {

            /*
             * Ignore clicks on the trash button.
             */

            if(
                event.target.closest(
                    ".secret-note-delete"
                )
            ){

                return;

            }


            /*
             * Find the actual note card.
             */

            const card =
                event.target.closest(
                    ".secret-note-card"
                );


            if(!card){

                return;

            }


            const noteId =
                card.dataset.noteId;


            if(!noteId){

                return;

            }


            /*
             * Open the exact Sent Note.
             */

            SC_SecretNotes_OpenNote(
                noteId,
                "sent"
            );

        }
    );

}

/* =====================================================
INITIAL RENDER
===================================================== */

SC_SecretNotes_Render();

if(typeof SC_ActivityHub_RefreshCounts === "function"){

    SC_ActivityHub_RefreshCounts();

}








/* =====================================================
MODULE: MUTUAL MATCH — SENDER SIDE + GUESSING SIDE
=====================================================

WHO IS WHO
  Person A = sent the crush first, KNOWS who they sent it to.
  Person B = received A's crush anonymously (played Guess
             My Crush), later sent a crush back.

  A -> gets the "Good news" overlay instantly, sees B's
       real profile, card is first in Mutual Crushes.
  B -> nothing happens at first (the match is "pending").
       When A sends the first chat message, B gets an
       overlay. B only sees what has been revealed so far
       (name they gave the game, revealed fields, photo
       is "?" unless revealed). Reveal Profile costs coins
       and shows only the revealed data.

HOW THIS IS BUILT FOR A DATABASE LATER
  1. SC_MutualStore  = the ONLY code that touches
     localStorage for these matches. To move to a database,
     rewrite the methods inside it (they will become
     async fetch calls) and nothing else has to change.

  2. SC_MutualSync   = the ONLY entry / exit points between
     this device and the other person:
       IN : SC_MutualSync.onSentCrushBecameMutual(...)
            SC_MutualSync.onIncomingCrushBecameMutual(...)
            SC_MutualSync.onFirstMessageFromMatch(...)
            SC_MutualSync.onOtherSideChatPaid(...)
            (your server / realtime listener calls these)
       OUT: SC_MutualSync.publishChatPaid(...)
            (currently does nothing; later it sends the
             payment to the database)

  3. TEST TOOLS at the bottom (SC_DEV_TOOLS) fake the
     other person on this one device. Set SC_DEV_TOOLS to
     false, or delete that section, when you go live.
===================================================== */


/* ---------------------------------------------
1. STORAGE LAYER  (swap for database later)
--------------------------------------------- */

const SC_MUTUAL_MATCHES_KEY =
    "secretCrushMutualMatches";

const SC_MUTUAL_OTHER_PAID_KEY =
    "secretCrushMutualOtherSidePaid";

const SC_MUTUAL_RECEIVER_KEY =
    "secretCrushMutualReceiverMatches";


const SC_MutualStore = {

    getMatches(){

        try{

            const list =
                JSON.parse(
                    localStorage.getItem(
                        SC_MUTUAL_MATCHES_KEY
                    ) || "[]"
                );

            return Array.isArray(list)
                ? list
                : [];

        }catch(error){

            return [];

        }

    },


    saveMatches(matches){

        localStorage.setItem(
            SC_MUTUAL_MATCHES_KEY,
            JSON.stringify(matches)
        );

    },


    /* matches on the GUESSING side (person B) */

    getReceiverMatches(){

        try{

            const list =
                JSON.parse(
                    localStorage.getItem(
                        SC_MUTUAL_RECEIVER_KEY
                    ) || "[]"
                );

            return Array.isArray(list)
                ? list
                : [];

        }catch(error){

            return [];

        }

    },


    saveReceiverMatches(matches){

        localStorage.setItem(
            SC_MUTUAL_RECEIVER_KEY,
            JSON.stringify(matches)
        );

    },


    isOtherSidePaid(matchId){

        try{

            const map =
                JSON.parse(
                    localStorage.getItem(
                        SC_MUTUAL_OTHER_PAID_KEY
                    ) || "{}"
                ) || {};

            return !!map[matchId];

        }catch(error){

            return false;

        }

    },


    setOtherSidePaid(matchId, paid){

        let map = {};

        try{

            map =
                JSON.parse(
                    localStorage.getItem(
                        SC_MUTUAL_OTHER_PAID_KEY
                    ) || "{}"
                ) || {};

        }catch(error){

            map = {};

        }

        map[matchId] = !!paid;

        localStorage.setItem(
            SC_MUTUAL_OTHER_PAID_KEY,
            JSON.stringify(map)
        );

    }

};


/* ---------------------------------------------
2. SENDER-SIDE MATCHES IN MEMORY
   (var on purpose: getMutualCrushes() can run
   before this file reaches this point)
--------------------------------------------- */

var SC_SENDER_MATCHES = [];


function SC_Mutual_GetSenderCrushes(){

    return Array.isArray(SC_SENDER_MATCHES)
        ? SC_SENDER_MATCHES
        : [];

}


function SC_Mutual_MatchToCrush(record){

    const profile =
        record.profile || {};

    return {

        id: record.id,

        side: "sender",

        sentCrushId: record.sentCrushId,

        name:
            profile.name ||
            profile.username ||
            "Your crush",

        username: profile.username || "",

        photo: profile.photo || "",

        school: profile.school || "",

        faculty: profile.faculty || "",

        year: profile.year || "",

        interests:
            Array.isArray(profile.interests)
                ? profile.interests
                : [],

        posts:
            Array.isArray(profile.posts)
                ? profile.posts
                : [],

        mutual: true,

        /* A already knows who this is */
        mutualRevealed: true,

        mutualChatUnlocked: !!record.chatUnlocked,

        mutualChatUnlockedAt:
            record.chatUnlockedAt || 0,

        matchedAt: record.matchedAt || 0,

        revealed:{
            name:true,
            year:true,
            school:true,
            faculty:true
        }

    };

}


function SC_Mutual_LoadSenderMatches(){

    SC_SENDER_MATCHES =
        SC_MutualStore
            .getMatches()
            .map(SC_Mutual_MatchToCrush);

}


/* Copies chat-unlock changes back into storage */

function SC_Mutual_SaveSenderMatches(){

    const records =
        SC_MutualStore.getMatches();

    records.forEach(record => {

        const crush =
            SC_Mutual_GetSenderCrushes()
                .find(
                    item => item.id === record.id
                );

        if(!crush) return;

        record.chatUnlocked =
            !!crush.mutualChatUnlocked;

        record.chatUnlockedAt =
            crush.mutualChatUnlockedAt || 0;

    });

    SC_MutualStore.saveMatches(records);

}


/* One lookup for BOTH kinds of mutual crush */

function SC_Mutual_FindCrush(crushId){

    return (
        SC_DEMO_CRUSHES.find(
            item => item.id === crushId
        )
        ||
        SC_Mutual_GetSenderCrushes().find(
            item => item.id === crushId
        )
        ||
        null
    );

}


/* ---------------------------------------------
3. WHAT EACH PERSON IS ALLOWED TO SEE
--------------------------------------------- */

/*
 * The name B gave the game in Guess My Crush.
 */

function SC_Mutual_GetGameName(crush){

    const names =
        typeof getCrushNames === "function"
            ? getCrushNames()
            : {};

    const game =
        typeof getCrushGames === "function"
            ? getCrushGames().find(
                item => item.crushId === crush.id
            )
            : null;

    return (
        names[crush.id] ||
        (game && game.customName) ||
        "My Secret Crush"
    );

}


function SC_Mutual_HasStartedGame(crush){

    return (
        typeof getCrushGames === "function" &&
        getCrushGames().some(
            item => item.crushId === crush.id
        )
    );

}


/*
 * Who sees what:
 *  - A (sender): everything.
 *  - B on a match made by the new flow (viaReverse):
 *    ONLY what has been revealed so far, even after
 *    paying for Reveal Profile.
 *  - Older demo matches: real name after Reveal Profile.
 */

function SC_Mutual_GetDisplayName(crush){

    if(crush.side === "sender"){
        return crush.name;
    }

    if(crush.viaReverse){

        return (
            crush.revealed &&
            crush.revealed.name
        )
            ? crush.name
            : SC_Mutual_GetGameName(crush);

    }

    if(crush.mutualRevealed){
        return crush.name;
    }

    return SC_Mutual_GetGameName(crush);

}


function SC_Mutual_GetDisplayPhoto(crush){

    if(crush.side === "sender"){
        return crush.photo || "";
    }

    if(crush.viaReverse){

        return (
            crush.revealed &&
            crush.revealed.photo
        )
            ? (crush.photo || "")
            : "";

    }

    if(crush.mutualRevealed){
        return crush.photo || "";
    }

    return "";

}


/*
 * Copy of the crush with only what this person is
 * allowed to see. Used by the list, the profile and
 * the chat screens.
 */

function SC_Mutual_AsViewer(crush){

    const view = Object.assign(
        {},
        crush,
        {
            name:
                SC_Mutual_GetDisplayName(crush),
            photo:
                SC_Mutual_GetDisplayPhoto(crush)
        }
    );

    if(crush.viaReverse){

        const revealed =
            crush.revealed || {};

        view.username = "";

        view.year =
            revealed.year
                ? crush.year
                : "Year hidden";

        view.school =
            revealed.school
                ? crush.school
                : "School hidden";

        view.faculty =
            revealed.faculty
                ? crush.faculty
                : "Faculty hidden";

        view.interests = [];

        view.posts = [];

    }

    return view;

}


/* ---------------------------------------------
4. CHAT PRICE
   whoever opens first pays, the other opens free
--------------------------------------------- */

/* What person A pays (they don't reveal first, so
   this is the full price). Change if you want. */

const SC_MUTUAL_SENDER_CHAT_COST =
    MUTUAL_CHAT_COST_BEFORE_REVEAL;


function SC_Mutual_GetChatCost(crush){

    if(crush.mutualChatUnlocked) return 0;

    if(SC_MutualStore.isOtherSidePaid(crush.id)){
        return 0;
    }

    if(crush.side === "sender"){
        return SC_MUTUAL_SENDER_CHAT_COST;
    }

    return crush.mutualRevealed
        ? MUTUAL_CHAT_COST_AFTER_REVEAL
        : MUTUAL_CHAT_COST_BEFORE_REVEAL;

}


/* ---------------------------------------------
5. SYNC POINTS WITH THE OTHER PERSON
   (your database / realtime listener plugs in here)
--------------------------------------------- */

const SC_MutualSync = {

    /*
     * IN: the database says a crush this user SENT
     * has become mutual.
     */

    onSentCrushBecameMutual(sentCrush){

        if(!sentCrush) return null;

        const existing =
            SC_MutualStore
                .getMatches()
                .find(
                    match =>
                        match.sentCrushId ===
                        sentCrush.id
                );

        if(existing) return existing;

  const target =
            (
                typeof getSentCrushTarget ===
                "function"
                    ? getSentCrushTarget(sentCrush)
                    : null
            ) || {};

        /* fill in anything the snapshot is missing
           (interests, posts, etc.) from the matching
           demo person, if there is one */

        const demoMatch =
            SC_DEMO_CRUSHES.find(
                item =>
                    (target.id && item.id === target.id)
                    ||
                    (
                        target.username &&
                        item.username &&
                        item.username.replace("@","").toLowerCase() ===
                        String(target.username).replace("@","").toLowerCase()
                    )
                    ||
                    (target.name && item.name === target.name)
            ) || {};

        const pickTargetField =
            field => {

                const value = target[field];

                const filled =
                    Array.isArray(value)
                        ? value.length
                        : value;

                return filled
                    ? value
                    : demoMatch[field];

            };

        const record = {

            id:
                "match-" + sentCrush.id,

            sentCrushId:
                sentCrush.id,

            profile:{
                id: target.id || "",
                name:
                    target.name ||
                    sentCrush.targetName ||
                    "",
                username: pickTargetField("username") || "",
                photo: pickTargetField("photo") || "",
                school: pickTargetField("school") || "",
                faculty: pickTargetField("faculty") || "",
                year: pickTargetField("year") || "",
                interests: pickTargetField("interests") || [],
                posts: pickTargetField("posts") || []
            },

            matchedAt: Date.now(),

            noticeSeen: false,

            chatUnlocked: false,

            chatUnlockedAt: 0

        };

        const matches =
            SC_MutualStore.getMatches();

        matches.unshift(record);

        SC_MutualStore.saveMatches(matches);


        /* flag the saved sent crush as mutual too */

        try{

            const sentItems =
                JSON.parse(
                    localStorage.getItem(
                        SENT_CRUSH_STORAGE_KEY
                    ) || "[]"
                );

            if(Array.isArray(sentItems)){

                const saved =
                    sentItems.find(
                        item =>
                            item.id === sentCrush.id
                    );

                if(saved){

                    saved.mutual = true;

                    localStorage.setItem(
                        SENT_CRUSH_STORAGE_KEY,
                        JSON.stringify(sentItems)
                    );

                }

            }

        }catch(error){

            console.error(error);

        }


        SC_Mutual_LoadSenderMatches();

        if(
            typeof SC_ActivityHub_RefreshCounts ===
            "function"
        ){
            SC_ActivityHub_RefreshCounts();
        }

        SC_Mutual_ProcessNotices();

        return record;

    },


    /*
     * IN: a crush this user RECEIVED (and has been
     * guessing) is now mutual because this user sent one
     * back. Nothing is shown yet: the match stays
     * "pending" until the other person sends a message.
     */

    onIncomingCrushBecameMutual(crushId){

        const crush =
            SC_DEMO_CRUSHES.find(
                item => item.id === crushId
            );

        if(!crush) return null;

        const matches =
            SC_MutualStore.getReceiverMatches();

        const existing =
            matches.find(
                item => item.crushId === crushId
            );

        if(existing) return existing;

        /* built-in demo crushes that were already mutual */

        if(crush.mutual === true) return null;

        const record = {

            crushId: crushId,

            state: "pending",

            matchedAt: Date.now(),

            openedAt: 0,

            noticeSeen: false,

            firstMessage: null,

            delivered: false

        };

        matches.unshift(record);

        SC_MutualStore.saveReceiverMatches(matches);

        SC_Reverse_Apply();

        return record;

    },


    /*
     * IN: the other person (who knows you) sent the
     * first chat message. They paid to open the chat, so
     * it is free for this user. This is what makes the
     * match visible and shows the overlay.
     */

    onFirstMessageFromMatch(crushId, text){

        const matches =
            SC_MutualStore.getReceiverMatches();

        const record =
            matches.find(
                item => item.crushId === crushId
            );

        if(!record || record.state === "open"){
            return null;
        }

        record.state = "open";

        record.openedAt = Date.now();

        record.firstMessage = {
            text: text || "Hey 👋",
            time: Date.now()
        };

        SC_MutualStore.saveReceiverMatches(matches);

        SC_MutualStore.setOtherSidePaid(
            crushId,
            true
        );

        SC_Reverse_Apply();

        if(
            typeof SC_ActivityHub_RefreshCounts ===
            "function"
        ){
            SC_ActivityHub_RefreshCounts();
        }

        SC_Mutual_ProcessNotices();

        return record;

    },


    /*
     * LOCAL STAND-IN for the server: when this user sends a
     * crush, check if that person had already crushed on
     * them. With a database, the server does this check
     * and calls onIncomingCrushBecameMutual instead.
     */

    checkSentCrushAgainstIncoming(sentItem){

        if(!sentItem || sentItem.type !== "crush"){
            return null;
        }

        const snapshot =
            sentItem.targetSnapshot || {};

        const clean =
            value =>
                String(value || "")
                    .replace("@","")
                    .toLowerCase();

        const incoming =
            SC_DEMO_CRUSHES.find(
                crush =>
                    (
                        sentItem.targetId &&
                        crush.id === sentItem.targetId
                    )
                    ||
                    (
                        snapshot.username &&
                        crush.username &&
                        clean(crush.username) ===
                        clean(snapshot.username)
                    )
                    ||
                    (
                        sentItem.targetName &&
                        crush.name === sentItem.targetName
                    )
            );

        if(!incoming) return null;

        return this.onIncomingCrushBecameMutual(
            incoming.id
        );

    },


    /*
     * IN: the other person paid to open the chat,
     * so this user can open it for free.
     */

    onOtherSideChatPaid(matchId){

        SC_MutualStore.setOtherSidePaid(
            matchId,
            true
        );

        if(
            typeof mutualCrushView !== "undefined" &&
            mutualCrushView &&
            mutualCrushView.classList.contains("active")
        ){
            renderMutualCrushes();
        }

    },


    /*
     * OUT: this user paid to open the chat.
     * LATER: send this to the database so the other
     * person's chat becomes free.
     */

    publishChatPaid(matchId){

        /* nothing to send yet (localStorage only) */

    }

};


/* ---------------------------------------------
5b. GUESSING SIDE: APPLY PENDING / OPEN MATCHES
--------------------------------------------- */

function SC_Reverse_Apply(){

    SC_MutualStore
        .getReceiverMatches()
        .forEach(record => {

            const crush =
                SC_DEMO_CRUSHES.find(
                    item =>
                        item.id === record.crushId
                );

            if(!crush) return;

            crush.viaReverse = true;

            /* hidden from Mutual Crushes until open */

            crush.mutual =
                record.state === "open";

            crush.matchedAt =
                record.openedAt || 0;

        });

}


/*
 * Puts the other person's first message into the chat
 * when this user opens it.
 */

function SC_Reverse_DeliverFirstMessage(crush){

    if(!crush || !crush.viaReverse) return;

    const matches =
        SC_MutualStore.getReceiverMatches();

    const record =
        matches.find(
            item => item.crushId === crush.id
        );

    if(
        !record ||
        !record.firstMessage ||
        record.delivered
    ){
        return;
    }

    const store =
        getChatStore();

    if(!Array.isArray(store[crush.id])){
        store[crush.id] = [];
    }

    store[crush.id].unshift({

        id:
            "message-" +
            record.firstMessage.time +
            "-first",

        from: "them",

        text: record.firstMessage.text,

        time: record.firstMessage.time,

        read: false

    });

    saveChatStore(store);

    record.delivered = true;

    SC_MutualStore.saveReceiverMatches(matches);

}


/* ---------------------------------------------
6. THE OVERLAY (Good news / It's mutual)
--------------------------------------------- */

(function SC_Mutual_InjectStyles(){

    const style =
        document.createElement("style");

    style.textContent = `

    .sc-mutual-notice{
        position:fixed;
        inset:0;
        z-index:9500;

        display:flex;
        align-items:center;
        justify-content:center;

        pointer-events:none;
        visibility:hidden;
    }

    .sc-mutual-notice.active{
        pointer-events:auto;
        visibility:visible;
    }

    .sc-mutual-notice-backdrop{
        position:absolute;
        inset:0;
        background:rgba(3,2,10,.88);
        backdrop-filter:blur(8px);
        -webkit-backdrop-filter:blur(8px);
        opacity:0;
        transition:opacity .3s ease;
    }

    .sc-mutual-notice.active .sc-mutual-notice-backdrop{
        opacity:1;
    }

    .sc-mutual-notice-panel{
        position:relative;
        width:min(88%,360px);
        padding:28px 20px 22px;
        border-radius:26px;
        border:1px solid rgba(255,77,145,.4);
        background:
            radial-gradient(
                circle at 50% 0%,
                rgba(255,77,145,.22),
                transparent 55%
            ),
            #0c0a14;
        box-shadow:0 0 40px rgba(255,77,145,.25);
        text-align:center;
        transform:scale(.92);
        opacity:0;
        transition:transform .25s ease,opacity .25s ease;
    }

    .sc-mutual-notice.active .sc-mutual-notice-panel{
        transform:scale(1);
        opacity:1;
    }

    .sc-mutual-notice-avatar{
        width:84px;
        height:84px;
        margin:0 auto 12px;
        border-radius:50%;
        overflow:hidden;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:34px;
        border:2px solid rgba(255,77,145,.7);
        box-shadow:0 0 22px rgba(255,77,145,.35);
        background:rgba(255,77,145,.12);
    }

    .sc-mutual-notice-avatar img{
        width:100%;
        height:100%;
        object-fit:cover;
    }

    .sc-mutual-notice-panel h2{
        margin:0 0 8px;
        color:#fff;
        font-size:19px;
    }

    .sc-mutual-notice-panel p{
        margin:0 0 8px;
        color:#b8b2c8;
        font-size:13px;
        line-height:1.5;
    }

    .sc-mutual-notice-panel p strong{
        color:#ff8fc0;
    }

    .sc-mutual-notice-open{
        width:100%;
        margin-top:12px;
        padding:13px;
        border:none;
        border-radius:999px;
        background:linear-gradient(120deg,#ff4d91,#9b5aff);
        color:#fff;
        font-weight:700;
        font-size:13px;
        letter-spacing:.4px;
    }

    .sc-mutual-notice-later{
        width:100%;
        margin-top:8px;
        padding:10px;
        border:none;
        background:transparent;
        color:#9c96ac;
        font-size:12px;
    }

    .sc-dev-tools{
        position:fixed;
        left:8px;
        bottom:96px;
        z-index:8000;
        display:flex;
        flex-direction:column;
        gap:6px;
        align-items:flex-start;
    }

    .sc-dev-tools button{
        padding:8px 10px;
        border-radius:12px;
        border:1px solid rgba(255,255,255,.2);
        background:rgba(20,16,30,.92);
        color:#cfc4ff;
        font-size:11px;
        text-align:left;
    }

    .sc-dev-tools-list{
        display:none;
        flex-direction:column;
        gap:6px;
    }

    .sc-dev-tools.open .sc-dev-tools-list{
        display:flex;
    }

    `;

    document.head.appendChild(style);

})();


let SC_mutualNoticeEl = null;

let SC_mutualNoticeRef = null;


function SC_Mutual_BuildNotice(){

    if(SC_mutualNoticeEl) return SC_mutualNoticeEl;

    const el =
        document.createElement("div");

    el.className = "sc-mutual-notice";

    el.id = "sc-mutual-notice";

    el.setAttribute("aria-hidden","true");

    el.innerHTML = `

        <div class="sc-mutual-notice-backdrop"></div>

        <section class="sc-mutual-notice-panel">

            <div
                class="sc-mutual-notice-avatar"
                id="sc-mutual-notice-avatar"
            ></div>

            <h2 id="sc-mutual-notice-title">💜 Good news!</h2>

            <p id="sc-mutual-notice-text"></p>

            <p id="sc-mutual-notice-extra"></p>

            <p id="sc-mutual-notice-hint"></p>

            <button
                type="button"
                class="sc-mutual-notice-open"
                id="sc-mutual-notice-open"
            >
                OPEN MUTUAL CRUSHES
            </button>

            <button
                type="button"
                class="sc-mutual-notice-later"
                id="sc-mutual-notice-later"
            >
                Later
            </button>

        </section>

    `;

    document.body.appendChild(el);

    el.querySelector("#sc-mutual-notice-open")
        .addEventListener(
            "click",
            () => SC_Mutual_CloseNotice(true)
        );

    el.querySelector("#sc-mutual-notice-later")
        .addEventListener(
            "click",
            () => SC_Mutual_CloseNotice(false)
        );

    SC_mutualNoticeEl = el;

    return el;

}


function SC_Mutual_NextNotice(){

    const sender =
        SC_MutualStore
            .getMatches()
            .find(match => !match.noticeSeen);

    if(sender){

        return {
            kind: "sender",
            record: sender
        };

    }

    const receiver =
        SC_MutualStore
            .getReceiverMatches()
            .find(
                match =>
                    match.state === "open" &&
                    !match.noticeSeen
            );

    if(receiver){

        return {
            kind: "receiver",
            record: receiver
        };

    }

    return null;

}


function SC_Mutual_ProcessNotices(){

    /* one overlay at a time */

    if(
        SC_mutualNoticeEl &&
        SC_mutualNoticeEl.classList.contains("active")
    ){
        return;
    }

    const next =
        SC_Mutual_NextNotice();

    if(!next) return;

    const el =
        SC_Mutual_BuildNotice();

    const title =
        el.querySelector("#sc-mutual-notice-title");

    const text =
        el.querySelector("#sc-mutual-notice-text");

    const extra =
        el.querySelector("#sc-mutual-notice-extra");

    const hint =
        el.querySelector("#sc-mutual-notice-hint");

    const avatar =
        el.querySelector("#sc-mutual-notice-avatar");


    if(next.kind === "sender"){

        /* PERSON A: knows who the crush is */

        const record = next.record;

        const profile =
            record.profile || {};

        const name =
            profile.name ||
            profile.username ||
            "your crush";

        SC_mutualNoticeRef = {
            kind: "sender",
            id: record.id
        };

        avatar.innerHTML =
            profile.photo
                ? `<img src="${escapePostHTML(profile.photo)}" alt="">`
                : "💜";

        title.textContent = "💜 Good news!";

        text.innerHTML =
            `Your crush with <strong>${escapePostHTML(name)}</strong> that you sent has become mutual.`;

        extra.textContent =
            "Remember: you know who they are, but they only know as much as you've revealed so far.";

        hint.textContent =
            "Open the Mutual Crushes interface to open a chat with them.";

    }else{

        /* PERSON B: still guessing */

        const record = next.record;

        const crush =
            SC_DEMO_CRUSHES.find(
                item => item.id === record.crushId
            );

        if(!crush){

            /* crush no longer exists: skip it */

            record.noticeSeen = true;

            const all =
                SC_MutualStore.getReceiverMatches();

            const saved =
                all.find(
                    item => item.crushId === record.crushId
                );

            if(saved) saved.noticeSeen = true;

            SC_MutualStore.saveReceiverMatches(all);

            return SC_Mutual_ProcessNotices();

        }

        const viewer =
            SC_Mutual_AsViewer(crush);

        SC_mutualNoticeRef = {
            kind: "receiver",
            id: record.crushId
        };

        avatar.innerHTML =
            viewer.photo
                ? `<img src="${escapePostHTML(viewer.photo)}" alt="">`
                : "❓";

        title.textContent = "💜 It's mutual!";

        text.textContent =
            "You sent a crush to someone, and apparently they had already sent one to you earlier on!";

        if(SC_Mutual_HasStartedGame(crush)){

            extra.innerHTML =
                `You know them as <strong>${escapePostHTML(viewer.name)}</strong>.`;

        }else{

            extra.textContent =
                "It's still a mystery who they are…";

        }

        hint.textContent =
            "Open the Mutual Crushes interface to start a chat with them.";

    }

    el.classList.add("active");

    el.setAttribute("aria-hidden","false");

}


function SC_Mutual_CloseNotice(openMutualScreen){

    const el = SC_mutualNoticeEl;

    if(!el) return;

    /* mark it seen so it never shows again */

    if(
        SC_mutualNoticeRef &&
        SC_mutualNoticeRef.kind === "sender"
    ){

        const matches =
            SC_MutualStore.getMatches();

        const record =
            matches.find(
                match =>
                    match.id === SC_mutualNoticeRef.id
            );

        if(record){

            record.noticeSeen = true;

            SC_MutualStore.saveMatches(matches);

        }

    }else if(SC_mutualNoticeRef){

        const matches =
            SC_MutualStore.getReceiverMatches();

        const record =
            matches.find(
                match =>
                    match.crushId === SC_mutualNoticeRef.id
            );

        if(record){

            record.noticeSeen = true;

            SC_MutualStore.saveReceiverMatches(matches);

        }

    }

    el.classList.remove("active");

    el.setAttribute("aria-hidden","true");

    if(openMutualScreen){

        SC_Mutual_CloseOverlays();

        setTimeout(
            openMutualCrushesPage,
            150
        );

    }

    /* show the next waiting notice, if any */

    setTimeout(
        SC_Mutual_ProcessNotices,
        500
    );

}


/*
 * Closes whatever screen the person is on top of, so
 * the next screen opens cleanly.
 */

function SC_Mutual_CloseOverlays(){

    document
        .querySelectorAll(
            '.active[aria-hidden="false"]'
        )
        .forEach(element => {

            if(element.id === "sc-mutual-notice"){
                return;
            }

            element.classList.remove("active");

            element.setAttribute(
                "aria-hidden",
                "true"
            );

        });

    if(typeof closeActivityHub === "function"){

        closeActivityHub();

    }

}


/* ---------------------------------------------
7. SENT CRUSHES "CHAT" BUTTONS
   For a crush that has a mutual match, these must
   go through the same pay / free logic instead of
   opening the chat for free.
--------------------------------------------- */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-detail-chat], [data-chat-crush]"
            );

        if(!button) return;

        const sentId =
            button.dataset.detailChat ||
            button.dataset.chatCrush;

        const match =
            SC_Mutual_GetSenderCrushes()
                .find(
                    item =>
                        item.sentCrushId === sentId
                );

        if(!match) return;

        event.stopPropagation();

        event.preventDefault();

        attemptMutualChat(match.id);

    },
    true
);


/* ---------------------------------------------
8. "VIEW PROFILE" BUTTON ON A REVEALED CARD
--------------------------------------------- */

if(typeof mutualCrushList !== "undefined" && mutualCrushList){

    mutualCrushList.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-mutual-view]"
                );

            if(!button) return;

            openMutualProfilePage(
                button.dataset.mutualView
            );

        }
    );

}


/* ---------------------------------------------
9. START UP
--------------------------------------------- */

SC_Reverse_Apply();

SC_Mutual_LoadSenderMatches();


/*
 * Wrap two existing functions (nothing else in the file
 * has to change):
 *  - opening a mutual chat first delivers the other
 *    person's first message
 *  - sending a crush checks if it makes a match
 */

const SC_original_openMutualChatThread =
    openMutualChatThread;

openMutualChatThread = function(crush){

    SC_Reverse_DeliverFirstMessage(crush);

    return SC_original_openMutualChatThread(crush);

};


const SC_original_saveSentCrushOrNote =
    saveSentCrushOrNote;

saveSentCrushOrNote = function(item){

    const result =
        SC_original_saveSentCrushOrNote(item);

    try{

        SC_MutualSync
            .checkSentCrushAgainstIncoming(item);

    }catch(error){

        console.error(error);

    }

    return result;

};


if(typeof SC_ActivityHub_RefreshCounts === "function"){

    SC_ActivityHub_RefreshCounts();

}

/* show any overlay the person missed while away */

setTimeout(
    SC_Mutual_ProcessNotices,
    1500
);


/* ---------------------------------------------
10. TEST TOOLS  (fake the other person on this phone)
    Set to false, or delete this section, when you
    connect the real database.
--------------------------------------------- */

const SC_DEV_TOOLS = true;

if(SC_DEV_TOOLS){

    const tools =
        document.createElement("div");

    tools.className = "sc-dev-tools";

    tools.innerHTML = `

        <button type="button" id="sc-dev-toggle">🧪</button>

        <div class="sc-dev-tools-list">

            <button type="button" id="sc-dev-make-mutual">
                Make my next sent crush mutual
            </button>

            <button type="button" id="sc-dev-other-paid">
                Other person paid for chat
            </button>

            <button type="button" id="sc-dev-reverse-match">
                I sent a crush to someone who crushed on me
            </button>

            <button type="button" id="sc-dev-first-message">
                They sent me their first message
            </button>

        </div>

    `;

    document.body.appendChild(tools);

    tools.querySelector("#sc-dev-toggle")
        .addEventListener(
            "click",
            () => tools.classList.toggle("open")
        );

    tools.querySelector("#sc-dev-make-mutual")
        .addEventListener(
            "click",
            () => {

                const matches =
                    SC_MutualStore.getMatches();

                const next =
                    getSentCrushDisplayData()
                        .find(
                            sent =>
                                !matches.some(
                                    match =>
                                        match.sentCrushId ===
                                        sent.id
                                )
                        );

                if(!next){

                    alert(
                        "No sent crush left to make mutual. Send a new crush first."
                    );

                    return;

                }

                tools.classList.remove("open");

                SC_MutualSync
                    .onSentCrushBecameMutual(next);

            }
        );

    tools.querySelector("#sc-dev-other-paid")
        .addEventListener(
            "click",
            () => {

                const target =
                    getMutualCrushes()
                        .find(
                            crush =>
                                !crush.mutualChatUnlocked &&
                                !SC_MutualStore
                                    .isOtherSidePaid(crush.id)
                        );

                if(!target){

                    alert(
                        "No mutual crush is waiting for a chat."
                    );

                    return;

                }

                SC_MutualSync
                    .onOtherSideChatPaid(target.id);

                tools.classList.remove("open");

                alert(
                    "The other person has paid, so the chat is now free for the crush at the top of your waiting list."
                );

            }
        );


    tools.querySelector("#sc-dev-reverse-match")
        .addEventListener(
            "click",
            () => {

                const records =
                    SC_MutualStore.getReceiverMatches();

                const crush =
                    SC_DEMO_CRUSHES.find(
                        item =>
                            !item.mutual &&
                            !records.some(
                                record =>
                                    record.crushId === item.id
                            )
                    );

                if(!crush){

                    alert(
                        "No incoming crush left to match."
                    );

                    return;

                }

                SC_MutualSync
                    .onIncomingCrushBecameMutual(crush.id);

                tools.classList.remove("open");

                alert(
                    "Match is pending for " +
                    SC_Mutual_GetGameName(crush) +
                    ". Nothing shows until they message you."
                );

            }
        );

    tools.querySelector("#sc-dev-first-message")
        .addEventListener(
            "click",
            () => {

                const record =
                    SC_MutualStore
                        .getReceiverMatches()
                        .find(
                            item => item.state === "pending"
                        );

                if(!record){

                    alert(
                        "No pending match. Tap the button above first."
                    );

                    return;

                }

                tools.classList.remove("open");

                SC_MutualSync.onFirstMessageFromMatch(
                    record.crushId,
                    "Hey 👋 I heard you've been trying to figure me out..."
                );

            }
        );

}


/* =====================================================
FIX: MISSING "WITHDRAWN CRUSH" HELPERS

The Sent Crushes code calls these, but they were not
defined anywhere, which made Sent Crushes throw an error
when the person had not saved any sent crush yet, and
made "Unsend" fail.
===================================================== */

const SENT_CRUSH_WITHDRAWN_KEY =
    "secretCrushWithdrawnSentCrushes";


function getWithdrawnCrushRecords(){

    try{

        const list =
            JSON.parse(
                localStorage.getItem(
                    SENT_CRUSH_WITHDRAWN_KEY
                ) || "[]"
            );

        return Array.isArray(list)
            ? list
            : [];

    }catch(error){

        return [];

    }

}



/* =====================================================
MODULE: FULLSCREEN MOMENT VIDEO CONTROLS
===================================================== */

function SC_VT_Play(video) {
    video.muted = false;
    const p = video.play();
    if (p && p.catch) {
        p.catch(() => {
            video.muted = true;
            video.play().catch(() => {});
        });
    }
}

const SC_VT_BOX_SELECTOR = ".sc-feed-moment-media, .sc-profile-moment-media";

document.addEventListener("click", event => {
    const button = event.target.closest(".sc-vt-btn");
    const box = event.target.closest(SC_VT_BOX_SELECTOR);
    if (!box) return;

    if (!button && event.target.closest(
        "button, a, .sc-profile-moment-side-actions, .sc-feed-moment-actions"
    )) return;

    const video = box.querySelector("video");
    if (!video) return;

    event.preventDefault();
    event.stopPropagation();

    if (video.paused) {
        SC_VT_Play(video);
        box.classList.remove("sc-vt-paused");
    } else if (video.muted) {
        video.muted = false;
    } else {
        video.pause();
        box.classList.add("sc-vt-paused");
    }
}, true);

document.addEventListener("play", event => {
    if (!(event.target instanceof HTMLVideoElement)) return;
    const box = event.target.closest(SC_VT_BOX_SELECTOR);
    if (box) box.classList.remove("sc-vt-paused");
}, true);

/* Re-draw every like heart/count from saved like data. */
function SC_Moment_RefreshAllLikeUI() {
    try {
        const storage = SC_Moment_ReadLikeStorage() || {};
        Object.keys(storage).forEach(postId => {
            const state = SC_Moment_GetLikeState({ id: postId });
            SC_Moment_SyncLikeUI(postId, state);
        });
    } catch (error) {
        console.warn("Could not refresh likes:", error);
    }
}

/* About statement: use the person's own value, else look it up. */
function SC_Profile_ResolveAbout(crush) {
    const direct = String(
        (crush && (crush.about || crush.profileAbout)) || ""
    ).trim();
    if (direct) return direct;
    if (!crush || !crush.id) return "";

    try {
        const me = getCurrentProfile();
        if (me && me.userId === crush.id && me.about) {
            return String(me.about).trim();
        }
    } catch (e) {}

    try {
        const saved = JSON.parse(
            localStorage.getItem("secretCrushMoments") || "[]"
        );
        const hit = Array.isArray(saved) && saved.find(p =>
            (p.ownerId === crush.id || p.userId === crush.id) && p.about
        );
        if (hit) return String(hit.about).trim();
    } catch (e) {}

    return "";
}

/* Tap the poster's info in fullscreen -> open their profile. */
function SC_OpenPosterProfile(postId) {
    const post = (SC_FeedMomentItems || []).find(
        item => String(item.id) === String(postId)
    );
    if (!post || !mutualProfileView) return;

    let person = {
        id: post.ownerId || post.userId || post.username || post.name,
        name: post.name,
        username: post.username || post.name,
        photo: post.profilePicture || post.photo || "",
        school: post.institution || "",
        faculty: post.faculty || "",
        year: post.year || "",
        gender: post.gender || "",
        about: post.about || "",
        interests: Array.isArray(post.interests) ? post.interests : [],
        posts: []
    };

    try {
        const me = getCurrentProfile();
        if (me && me.userId && me.userId === person.id) {
            person = {
                ...person,
                name: me.name || person.name,
                username: me.username || person.username,
                photo: me.profilePicture || person.photo,
                school: me.institution || person.school,
                faculty: me.faculty || person.faculty,
                year: me.year || person.year,
                gender: me.gender || person.gender,
                about: me.about || person.about,
                interests: Array.isArray(me.interests) ? me.interests : person.interests
            };
        }
    } catch (e) {}

    /* pause the fullscreen video behind the profile */
    if (SC_FeedMomentViewer) {
        SC_FeedMomentViewer.querySelectorAll("video").forEach(v => {
            v.pause();
            const box = v.closest(".sc-feed-moment-media");
            if (box) box.classList.add("sc-vt-paused");
        });
    }

    openSecretCrushUserProfile(person);
    mutualProfileView.classList.add("sc-profile-over-viewer");
}

document.addEventListener("click", event => {
    const target = event.target.closest("[data-feed-moment-profile]");
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    SC_OpenPosterProfile(target.dataset.feedMomentProfile);
}, true);