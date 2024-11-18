import supabase from './../../../lib/supabase.js';

async function fetchUsers() {
    const { data, error } = await supabase
      .from('user_data') // Replace 'users' with your table name
      .select('*'); // Fetch all columns
    
        if (error) {
        console.error('Error fetching users:', error);
        } else {
        console.log('Users:', data);
        }
    }

fetchUsers();

async function signUp(mail, pswd) {
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

export default function Home() {
    fetchUsers();
    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>

            {/** Name input */}
            <div>
                <label>
                    Name: 
                    <input 
                    type="text" 
                    name="name" 
                    //value={formData.name} 
                    //onChange={hanleChange} 
                    placeholder="Enter your name">
                    </input>
                </label>
            </div>

            {/** Email input */}
            <div>
                <label>
                    Email:
                    <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email">
                    </input>
                </label>
            </div>

            {/** Password input */}
            <div>
                <label>
                    Password:
                    <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password">
                    </input>
                </label>
            </div>

            {/** Submit button */}
            <button
            type="submit">Sign up</button>
        </form>
        </div>
    );
}