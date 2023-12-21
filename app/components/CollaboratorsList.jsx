import axios from "axios";

const CollaboratorsList = ({ collaborators, setCollaborators, setLoading }) => {
  const handleRemoveCollaborator = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${process.env.NEXT_PUBLIC_API}/api/colab/${id}`);

      setCollaborators(collaborators.filter((colab) => colab.id !== id));
      setLoading(false);
    } catch (error) {
      console.error("Error removing collaborator:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
      {collaborators.map((collaborator) => (
        <div
          key={collaborator.id}
          className="p-4 border rounded-md flex items-center justify-between"
        >
          <div>
            <p className="text-lg font-semibold">{collaborator.user.name}</p>
            <p className="text-gray-600">{collaborator.user.email}</p>
          </div>
          <button
            onClick={() => handleRemoveCollaborator(collaborator.id)}
            className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md"
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};

export default CollaboratorsList;
