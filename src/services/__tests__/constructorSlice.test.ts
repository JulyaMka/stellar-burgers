import constructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  initialState
} from '../slices/constructorSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: '1',
  name: 'Test Bun',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 100,
  price: 200,
  image: '',
  image_large: '',
  image_mobile: ''
};

const mockIngredient: TIngredient = {
  _id: '2',
  name: 'Test Ingredient',
  type: 'main',
  proteins: 15,
  fat: 10,
  carbohydrates: 5,
  calories: 150,
  price: 150,
  image: '',
  image_large: '',
  image_mobile: ''
};

describe('constructor slice', () => {
  it('возвращает начальное состояние', () => {
    expect(constructorReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('обрабатывает добавление булки', () => {
    const action = addBun(mockBun);
    const state = constructorReducer(initialState, action);

    expect(state.bun).toEqual(mockBun);
    expect(state.ingredients).toEqual([]);
  });

  it('обрабатывает добавление ингредиента', () => {
    const action = addIngredient(mockIngredient);
    const state = constructorReducer(initialState, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(mockIngredient);
    expect(state.ingredients[0]).toHaveProperty('id');
    expect(state.bun).toBeNull();
  });

  it('обрабатывает удаление ингредиента', () => {
    const addAction = addIngredient(mockIngredient);
    let state = constructorReducer(initialState, addAction);

    const ingredientId = state.ingredients[0].id;
    const removeAction = removeIngredient(ingredientId);
    state = constructorReducer(state, removeAction);

    expect(state.ingredients).toHaveLength(0);
  });

  it('обрабатывает перемещение ингредиента', () => {
    const ingredient1 = { ...mockIngredient, _id: '1' };
    const ingredient2 = { ...mockIngredient, _id: '2' };

    const addAction1 = addIngredient(ingredient1);
    let state = constructorReducer(initialState, addAction1);

    const addAction2 = addIngredient(ingredient2);
    state = constructorReducer(state, addAction2);

    const moveAction = moveIngredient({ fromIndex: 0, toIndex: 1 });
    state = constructorReducer(state, moveAction);

    expect(state.ingredients[0]._id).toBe('2');
    expect(state.ingredients[1]._id).toBe('1');
  });

  it('обрабатывает очистку конструктора', () => {
    const addBunAction = addBun(mockBun);
    const addIngAction = addIngredient(mockIngredient);

    let state = constructorReducer(initialState, addBunAction);
    state = constructorReducer(state, addIngAction);

    const clearAction = clearConstructor();
    state = constructorReducer(state, clearAction);

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});
