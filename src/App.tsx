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

type ApiType = 'users'|'users-bd'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [type, setType] = useState<ApiType>('users-bd')
  const [currentUsers, setCurrentUsers] = useState<User|null>(null)

  const getUsers = async (type: ApiType) => {
    try {
      const response = await fetch(`${BASE_URL}/api/${type}`)
      const data: Response<User[]> = await response.json()
      setUsers(data.data)
    } catch (error) {
      console.error('Ошибка при получении пользователей:', error)
    }
  }

  const getCurrentUsers = async (type: ApiType, id: string): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/api/${type}/${id}`)
      const data: Response<User> = await response.json() // Указываем тип данных
      setCurrentUsers(data.data)
    } catch (error) {
      console.error('Ошибка при получении пользователей:', error)
    }
  }

  const createUser = async (type: ApiType): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/api/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'new name', email: `${crypto.randomUUID()}@gmail.com` })
      })
      const data: Response<User> = await response.json()
      setUsers([...users, data.data])
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error)
    }
  }

  const updateUser = async (type: ApiType, id: string, email: string): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/api/${type}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'update name', email })
      })
      const data: Response<User> = await response.json()
      setUsers(users.map(user => (user.id === id ? data.data : user
      )))
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error)
    }
  }

  const deleteUser = async (type: ApiType, id: string): Promise<void> => {
    try {
      await fetch(`${BASE_URL}/api/${type}/${id}`, {
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
        <span>запрос идет на {type === 'users-bd' ? 'к базе данных' : 'за массивом на беке'}</span> ===
        <input type="checkbox" value={type} onChange={() => setType(type === 'users' ? 'users-bd' : 'users')}/>
      </div>

      <div>
        Запрошенный пользователь === {currentUsers && currentUsers.email + currentUsers.name + currentUsers.id}
      </div>
      <button onClick={() => getUsers(type)}>получить пользователей</button>
      <button onClick={() => createUser(type)}>создать пользователя</button>
      <h1>Пользователи</h1>
      <ul>
        {users.map(user => (
          user && <li key={user?.id}>
            {user?.name} - {user?.email}
            <button onClick={() => updateUser(type, user?.id, user?.email)}>Обновить
            </button>
            <button onClick={() => deleteUser(type, user?.id)}>Удалить</button>
            <button onClick={() => getCurrentUsers(type, user?.id)}>получить пользователя</button>
          </li>
          ))}
      </ul>
    </div>
  )
}

export default App
