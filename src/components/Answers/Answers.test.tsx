import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Answers, { Props } from './Answers';
import { PossibleAnswers } from '../../data/types';
import { QUESTION_TYPES } from '../../data/constants';

const multipleStringAnswers = ['answer1', 'answer2', 'answer3']

const defaultProps: Props = {
    questionType: QUESTION_TYPES.TEXTBOX,
    onUpdateAnswers: (answers: PossibleAnswers) => {},
};

test('renders TEXTBOX answers component', () => {
    render(<Answers {...defaultProps} questionType={QUESTION_TYPES.TEXTBOX} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
});

test('can fill in TEXTBOX answers component', () => {
    render(<Answers {...defaultProps} questionType={QUESTION_TYPES.TEXTBOX} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input).toHaveValue('test');
});

test('can fill in and empty TEXTBOX answers component', () => {
    render(<Answers {...defaultProps} questionType={QUESTION_TYPES.TEXTBOX} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.change(input, { target: { value: '' } });
    expect(input).toHaveValue('');
});

test('renders DROPDOWN answers component with multiple string answers', () => {
    render(<Answers {...defaultProps} questionType={QUESTION_TYPES.DROPDOWN} answers={multipleStringAnswers} />);
});

test('renders CHECKBOX answers component with multiple choice answers', () => {
    render(<Answers {...defaultProps} questionType={QUESTION_TYPES.CHECKBOX} answers={multipleStringAnswers} />);
});