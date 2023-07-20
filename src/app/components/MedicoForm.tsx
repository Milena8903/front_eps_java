import React, { useEffect, useState } from "react";
//import "./AdvisorForm.css"; // Import CSS for animation

interface Especialidad{
  nombre: string;
  _links: Record<string, { href: string }>;
}

interface Medico{
  tarjetaProfesional : string;
  nombre: string;
  apellido: string;
  consultorio: string;
  email: string;
}

const MedicoForm = () => {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [medicos, setMedicos] = useState<Medico>({
    tarjetaProfesional: "",
    nombre: "",
    apellido: "",
    consultorio: "",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch("http://localhost:8080/especialidades");
        const data = await response.json();
        setEspecialidades(data._embedded.especialidades);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPrograms();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setMedicos({
      tarjetaProfesional: e.target.tarjetaProfesional.value,
      nombre: e.target.nombre.value,
      apellido: e.target.apellido.value,
      consultorio: e.target.cosultorio.value,
      email: e.target.email.value,
    });

    console.log(medicos);

    try {
      const response = await fetch("http://localhost:8080/medicos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(medicos),
      });

      const data = await response.json();
      console.log(data);

      e.target.reset(); // Clear the form
      setSubmitted(true); // Set the submitted state to true
      setTimeout(() => setSubmitted(false), 3000); // Reset the submitted state after 3 seconds
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <input type="text" name="tarjetaProfesional" placeholder="Tarjeta Profesional" />
        <input type="text" name="nombre" placeholder="Nombre" />
        <input type="text" name="apellido" placeholder="Apellido" />
        <input type="text" name="cosultorio" placeholder="Consultorio" />
        <input type="email" name="email" placeholder="Correo" />
        <select name="program">
          <option value="0">Seleccione un programa</option>
          {especialidades.map((especialidad) => (
            <option value={especialidad._links.especialidad.href}>
              {especialidad.nombre}
            </option>
          ))}
        </select>
        <button type="submit">Guardar</button>
      </form>
      {submitted && <div className="success-message">Record inserted successfully!</div>}
    </div>
  );
};

export default MedicoForm;
