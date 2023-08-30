import GroupForm from "./GroupForm";

const CreateGroupForm = () => {
  const group = {
    city:'',
    state:'',
    name: '',
    about: '',
    type: '',
    private: '',
    imageUrl: ''
  }
  return (
    <GroupForm 
      group={group}
      formType="createGroup"
    />
  )
}

export default CreateGroupForm