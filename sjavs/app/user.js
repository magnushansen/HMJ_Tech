const { default: supabase } = require("@/lib/supabase");

async function createUser(mail, pswd) {
    const { data, error } = await supabase.auth.signUp({
        email: mail,
        password: pswd,
    });

    if (error) {
        console.error("Error creating user:", error);
    } else {
        console.log("User created successfully:", data);
    }
}

async function logIn(mail, pswd) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: mail,
        password: pswd,
    })

    if (error) {
        console.error("Error logging in:", error);
    } else {
        console.log("Logged in successfully:", data);
    }
}