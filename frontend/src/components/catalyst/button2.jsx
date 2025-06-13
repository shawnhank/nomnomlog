import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import React, { forwardRef } from 'react'
import { Link } from './link'

const styles = {
  base: [
    'relative isolate inline-flex items-center justify-center gap-x-2 rounded-lg border text-base/6 font-semibold',
    'px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)] sm:text-sm/6',
    'focus:not-data-focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500',
    'data-disabled:opacity-50',
    '*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center *:data-[slot=icon]:text-(--btn-icon) sm:*:data-[slot=icon]:my-1 sm:*:data-[slot=icon]:size-4 forced-colors:[--btn-icon:ButtonText] forced-colors:data-hover:[--btn-icon:ButtonText]',
  ],
  solid: [
    'border-transparent bg-(--btn-border)',
    'dark:bg-(--btn-bg)',
    'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-(--btn-bg)',
    'before:shadow-sm',
    'dark:before:hidden',
    'dark:border-white/5',
    'after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)]',
    'after:shadow-[inset_0_1px_--theme(--color-white/15%)]',
    'data-active:after:bg-(--btn-hover-overlay) data-hover:after:bg-(--btn-hover-overlay)',
    'dark:after:-inset-px dark:after:rounded-lg',
    'data-disabled:before:shadow-none data-disabled:after:shadow-none',
  ],
  outline: [
    'border-zinc-950/10 text-zinc-950 data-active:bg-zinc-950/2.5 data-hover:bg-zinc-950/2.5',
    'dark:border-white/15 dark:text-white dark:[--btn-bg:transparent] dark:data-active:bg-white/5 dark:data-hover:bg-white/5',
    '[--btn-icon:var(--color-zinc-500)] data-active:[--btn-icon:var(--color-zinc-700)] data-hover:[--btn-icon:var(--color-zinc-700)] dark:data-active:[--btn-icon:var(--color-zinc-400)] dark:data-hover:[--btn-icon:var(--color-zinc-400)]',
  ],
  plain: [
    'border-transparent text-zinc-950 data-active:bg-zinc-950/5 data-hover:bg-zinc-950/5',
    'dark:text-white dark:data-active:bg-white/10 dark:data-hover:bg-white/10',
    '[--btn-icon:var(--color-zinc-500)] data-active:[--btn-icon:var(--color-zinc-700)] data-hover:[--btn-icon:var(--color-zinc-700)] dark:[--btn-icon:var(--color-zinc-500)] dark:data-active:[--btn-icon:var(--color-zinc-400)] dark:data-hover:[--btn-icon:var(--color-zinc-400)]',
  ],
  colors: {
    /* unchanged color block */
    // (Omitted here for brevity – yours stays untouched)
  },
}

export const Button = forwardRef(function Button(
  {
    color,
    outline,
    plain,
    icon: Icon,
    iconRight: IconRight,
    className,
    children,
    ...props
  },
  ref
) {
  const classes = clsx(
    className,
    styles.base,
    outline ? styles.outline : plain ? styles.plain : clsx(styles.solid, styles.colors[color ?? 'dark/zinc'])
  )

  const content = (
    <TouchTarget>
      {Icon && <Icon data-slot="icon" aria-hidden="true" />}
      <span className="inline-flex items-center gap-x-1">{children}</span>
      {IconRight && <IconRight data-slot="icon" aria-hidden="true" />}
    </TouchTarget>
  )

  return 'href' in props ? (
    <Link {...props} className={classes} ref={ref}>
      {content}
    </Link>
  ) : (
    <Headless.Button {...props} className={clsx(classes, 'cursor-default')} ref={ref}>
      {content}
    </Headless.Button>
  )
})

export function TouchTarget({ children }) {
  return (
    <>
      <span
        className="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden"
        aria-hidden="true"
      />
      {children}
    </>
  )
}