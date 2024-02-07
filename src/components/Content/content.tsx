import { createElement, ReactNode } from 'react';
import { content } from './content.module.css';

type ContentProps = {
  type: string;
  children: ReactNode;
};

export default function Content({ type, children }: ContentProps) {
  return (
    createElement(type, { className: `${content} container` }, children)
  )
};
