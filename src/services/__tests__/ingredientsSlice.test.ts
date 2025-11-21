import ingredientsReducer, { getIngredients } from '../slices/ingriedientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Test Ingredient 1',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 200,
    image: '',
    image_large: '',
    image_mobile: ''
  },
  {
    _id: '2',
    name: 'Test Ingredient 2',
    type: 'main',
    proteins: 15,
    fat: 10,
    carbohydrates: 5,
    calories: 150,
    price: 150,
    image: '',
    image_large: '',
    image_mobile: ''
  }
];

describe('ingredients slice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  it('обрабатывает состояние загрузки ингредиентов', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);

    expect(state).toEqual({
      ingredients: [],
      loading: true,
      error: null
    });
  });

  it('обрабатывает успешную загрузку ингредиентов', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(initialState, action);

    expect(state).toEqual({
      ingredients: mockIngredients,
      loading: false,
      error: null
    });
  });

  it('обрабатывает ошибку загрузки ингредиентов', () => {
    const action = {
      type: getIngredients.rejected.type,
      error: { message: 'Error loading ingredients' }
    };
    const state = ingredientsReducer(initialState, action);

    expect(state).toEqual({
      ingredients: [],
      loading: false,
      error: 'Error loading ingredients'
    });
  });
});
