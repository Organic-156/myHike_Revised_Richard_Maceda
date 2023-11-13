// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
        // This is earlier version of code without putting the users data to firebase but is just stored in authentication -Richard
        // ---------------------------------------------------------------------------------------------------------------
        // signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        //     // User successfully signed in.
        //     // Return type determines whether we continue the redirect automatically
        //     // or whether we leave that to developer to handle.
        //     return true;
        // },
        // uiShown: function () {
        //     // The widget is rendered.
        //     // Hide the loader.
        //     document.getElementById('loader').style.display = 'none';
        // }
        // ---------------------------------------------------------------------------------------------------------------

        //newVersion
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            //------------------------------------------------------------------------------------------
            // The code below is modified from default snippet provided by the FB documentation.
            //
            // If the user is a "brand new" user, then create a new "user" in your own database.
            // Assign this user with the name and email provided.
            // Before this works, you must enable "Firestore" from the firebase console.
            // The Firestore rules must allow the user to write. 
            //------------------------------------------------------------------------------------------
            var user = authResult.user;                            // get the user object from the Firebase authentication database
            if (authResult.additionalUserInfo.isNewUser) {         //if new user
                db.collection("users").doc(user.uid).set({         //write to firestore. We are using the UID for the ID in users collection
                    //name: user.displayName,                    //"users" collection
                    name: user.name,                    //I tried calling by field which is name, idk why call it displayName but it also works -Richard
                    email: user.email,                         //with authenticated user's ID (user.uid)
                    country: "Canada",                      //optional default profile info      
                    school: "BCIT"                          //optional default profile info
                }).then(function () {
                    console.log("New user added to firestore");
                    window.location.assign("main.html");       //re-direct to main.html after signup
                }).catch(function (error) {
                    console.log("Error adding new user: " + error);
                });
            } else {
                return true;
            }
            return false;
        },
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    // This code from documentation got replace with the code below it
    // signInSuccessUrl: '<url-to-redirect-to-on-success>',
    signInSuccessUrl: "main.html",
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        //Only Email sign in is enabled not providers
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'

    
};


// ------------------ Ths does not work, its supposed to make existing accounts login without problem. ------------------
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/v8/firebase.User
        var uid = user.uid;
        // ...
    } else {
        // User is signed out
        // ...
    }
});


//this method will wait until DOM is loaded
ui.start('#firebaseui-auth-container', uiConfig);