#lang racket/gui

(define black-pen (make-object pen% "BLACK" 1 'solid))
(define transparent-brush (make-object brush% "BLACK" 'transparent))

(define bloc-border-pen black-pen)
(define bloc-fill-brush transparent-brush)

(define test-block-y 100)

(define (redraw canvas dc)
  (send dc set-pen bloc-border-pen)
  (send dc set-brush bloc-fill-brush)
  (send dc draw-rectangle 100 test-block-y 10 10))

(define (mouse-ev ev)
  (display (send ev get-event-type))
  (display " ")
  (display (send ev get-x))
  (display " ")
  (displayln (send ev get-y)))

(define (keyboard-ev ev)
  (when (eq? (send ev get-key-code) 'down)
    (set! test-block-y (+ test-block-y 10))
    (send (send canvas get-dc) clear)
    (send canvas on-paint)))
      
(define my-canvas% (class canvas%
                     (define/override (on-event ev) (mouse-ev ev))
                     (define/override (on-char ev) (keyboard-ev ev))
                     (super-new)))

(define frame (new frame% [label "Grunt"] [width 200] [height 200]))
(define canvas (new my-canvas% [parent frame] [paint-callback redraw]))

(define (grunt)
  (send frame show #t))