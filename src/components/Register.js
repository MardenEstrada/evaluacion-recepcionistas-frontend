// // src/components/Register.js
// import axios from 'axios';
// import React, { useState } from 'react';

// const Register = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:8000/api/register', { name, email, password });
//       localStorage.setItem('token', response.data.token);
//       // Redirigir al dashboard o cualquier otra página después del registro
//     } catch (error) {
//       console.error('Error al registrar', error);
//       alert('Error al registrar');
//     }
//   };

//   return (
//     <div>
//       <h1>Registrar</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="name">Nombre:</label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Registrar</button>
//       </form>
//     </div>
//   );
// };

// export default Register;
