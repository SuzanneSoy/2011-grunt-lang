#lang racket/gui

;; Prepare a canvas
(define (get-my-canvas on-mouse on-key on-paint)
  (define canvas '())
  (define my-canvas% (class canvas%
                       (define/override (on-event ev) (on-mouse ev canvas))
                       (define/override (on-char ev) (on-key ev canvas))
                       (super-new)))
  (define frame (new frame% [label "Grunt"] [width 200] [height 200]))
  (set! canvas (new my-canvas% [parent frame] [paint-callback on-paint]))
  (lambda ()
    (send frame show #t)))

;; Pens
(define black-pen (make-object pen% "BLACK" 1 'solid))
(define transparent-brush (make-object brush% "BLACK" 'transparent))
(define bloc-border-pen black-pen)
(define bloc-fill-brush transparent-brush)

(define test-block-y 100)

(define (redraw canvas dc)
  (send dc set-pen bloc-border-pen)
  (send dc set-brush bloc-fill-brush)
  (send dc draw-rectangle 100 test-block-y 10 10))

(define (mouse-ev ev canvas)
  (display (send ev get-event-type))
  (display " ")
  (display (send ev get-x))
  (display " ")
  (displayln (send ev get-y)))

(define (keyboard-ev ev canvas)
  (when (eq? (send ev get-key-code) 'down)
    (set! test-block-y (+ test-block-y 10))
    (send (send canvas get-dc) clear)
    (send canvas on-paint)))

(define grunt (get-my-canvas mouse-ev keyboard-ev redraw))

(define world '())