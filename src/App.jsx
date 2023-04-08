import React from "react"
import Auth from "./components/auth"
import { db, auth, storage } from "./config/firebase"
import { getDocs , collection, addDoc, deleteDoc, updateDoc, doc} from "firebase/firestore";
import { uploadBytes, ref } from "firebase/storage";
import { async } from "@firebase/util";

function App() {

  const [movieList, setMovieList] = React.useState([]);
  const movieCollectionRef = collection(db, "movies");
  const [inputData, setInputData] = React.useState({
    title : "",
    year: 0,
    oscar: false
  })
  const [newTitle, setNewTitle] = React.useState("");
  const [fileUpload, setFileUpload] = React.useState(null);

  const getMovieList = async () => {
    try {
      const data = await getDocs(movieCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
      console.log("movie list ",movieList);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    getMovieList();
  }, []);

  function handleChange(event){
    const {type, name, value, checked} = event.target;
    setInputData(prevData => ({
        ...prevData,
       [name] : type === "checkbox" ? checked : value
    }))
  }

  function editMovieTitle(event){
    setNewTitle(event.target.value);
  }

  const onSubmitMovie = async() => {
    try {await addDoc(movieCollectionRef, {
      title : inputData.title, 
      releaseYear : inputData.year, 
      oscar : inputData.oscar,
      userId : auth?.currentUser?.uid,
    })
    getMovieList();
    }
    catch(error){
      console.error(error)
    }
  }

  const deleteMovie = async(id) => {
    try{
      const movieDoc = doc(db, "movies", id)
      await deleteDoc(movieDoc)
      getMovieList();
    }
    catch(error){
      console.error(error)
    }
  }

  const updateMovieTitle = async(id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, {title : newTitle});
    getMovieList();
    
  }

  function changeFile(event){
    setFileUpload(event.target.files[0])
  } 

  const uploadFile = async() => {
    if(!fileUpload) return;
    const filesFolderRef = ref(storage, `ProjectFiles/${fileUpload.name}`);
    try
    {await uploadBytes(filesFolderRef, fileUpload);}
    catch(error){
      console.error(error);
    }
  }

  // const uploadFile = async () => {
  //   if (!fileUpload) return;
  //   const filesFolderRef = ref(storage, `ProjectFiles/${fileUpload.name}`);
  //   try {
  //     await uploadBytes(filesFolderRef, fileUpload);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };



  const movieElements = movieList.map(movie => (
    <div key = {movie.id}>
      <h1 style = {{color: movie.oscar ? "green" : "red"}}>{movie.title}</h1>
      <p>Release Year: {movie.releaseYear}</p>
      <p>Oscar : {movie.oscar ? "Yes" : "No"}</p>
      <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>
      <br/>
      <br/>
      <input
        placeholder="Change movie title..."
        // value = {newTitle}
        onChange = {editMovieTitle}
      />
      <button onClick={() => updateMovieTitle(movie.id)}> Update Title</button>
      <br/>
      <br/>
    </div>
  ))


  return (
    <div>
      <Auth/>

      <br/>
      <br/>
      <br/>

      <div>
        <input 
          placeholder="Movie Title..."
          name = "title"
          value = {inputData.title}
          onChange = {handleChange}
        />
        <input 
          placeholder="Release Year..." 
          type="number"
          name="year"
          value = {inputData.year}
          onChange = {handleChange}
        />
        <input
            type = "checkbox" 
            id = "oscar"
            name = "oscar"
            checked = {inputData.oscar}
            onChange = {handleChange}
          />
        <label htmlFor="oscar">Oscar Win?</label>
        <button onClick = {onSubmitMovie}>Submit Movie</button>
      </div>

      {movieElements}

      <br/>
      <br/>

      <div>
        <input 
            type = "file"
            onChange={changeFile}
          />
        <button onClick = {uploadFile}>
          Upload file
        </button>
      </div>
     
    </div>
  )
}

export default App
