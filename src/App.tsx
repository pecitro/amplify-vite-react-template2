import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

// import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';


import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { fetchAuthSession } from 'aws-amplify/auth';

import outputs from "../amplify_outputs.json";



const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [text, setText] = useState("")

  async function invokeHelloWorld() {
    const { credentials } = await fetchAuthSession()
    const awsRegion = outputs.auth.aws_region
    const functionName = outputs.custom.sayHelloFunctionName;

    const labmda = new LambdaClient({ credentials: credentials, region: awsRegion })
    const command = new InvokeCommand({
      FunctionName: functionName,
    });
    const apiResponse = await labmda.send(command);

    if (apiResponse.Payload) {
      const payload = JSON.parse(new TextDecoder().decode(apiResponse.Payload))
      setText(payload.message)
    }
  }

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    // <Authenticator>
    //   {({ signOut, user }) => (
    <main>
      {/* <h1>{user?.username}'s todos</h1> */}
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li
            onClick={() => deleteTodo(todo.id)}
            key={todo.id}>{todo.content}
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      {/* <button onClick={signOut}>Sign out</button> */}
      <div>
        <button onClick={invokeHelloWorld}>invokeHelloWorld</button>
        <div>{text}</div>
      </div>
    </main>
    //   )
    //   }
    // </Authenticator >
  );
}

export default App;
