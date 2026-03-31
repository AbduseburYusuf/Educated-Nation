import PersonForm from '../../components/PersonForm.jsx';

export default function AddPerson() {
  const handleSuccess = () => {
    alert('Person added successfully!');
    // Refresh lists or navigate
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Educated Person</h1>
      <PersonForm onSuccess={handleSuccess} />
    </div>
  );
}

