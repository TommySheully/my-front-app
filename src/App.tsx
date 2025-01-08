import { useState } from 'react'
import './App.css'

const BASE_URL = 'http://localhost:3000'

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Response<T> {
  data: T;
  message: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [currentUsers, setCurrentUsers] = useState<User|null>(null)

  const getUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users`)
      const data: Response<User[]> = await response.json()
      setUsers(data.data)
    } catch (error) {
      console.error('Ошибка при получении пользователей:', error)
    }
  }

  const getCurrentUsers = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/${id}`)
      const data: Response<User> = await response.json() // Указываем тип данных
      setCurrentUsers(data.data)
    } catch (error) {
      console.error('Ошибка при получении пользователей:', error)
    }
  }

  const createUser = async (): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'new name', email: 'new email' })
      })
      const data: Response<User> = await response.json()
      setUsers([...users, data.data])
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error)
    }
  }

  const updateUser = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'update name', email: 'update email' })
      })
      const data: Response<User> = await response.json()
      setUsers(users.map(user => (user.id === id ? data.data : user
      )))
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error)
    }
  }

  const deleteUser = async (id: string): Promise<void> => {
    try {
      await fetch(`${BASE_URL}/api/users/${id}`, {
        method: 'DELETE'
      })
      setUsers(users.filter(user => user.id !== id))
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error)
    }
  }

  return (
    <div className="App">
      <div>
        Запрошенный пользователь === {currentUsers && currentUsers.email + currentUsers.name + currentUsers.id}
      </div>
      <button onClick={getUsers}>получить пользователей</button>
      <button onClick={createUser}>создать пользователя</button>
      <h1>Пользователи</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => updateUser(user.id)}>Обновить
            </button>
            <button onClick={() => deleteUser(user.id)}>Удалить</button>
            <button onClick={() => getCurrentUsers(user.id)}>получить пользователя</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
