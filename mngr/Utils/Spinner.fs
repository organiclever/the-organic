module Utils.Spinner

open System
open System.Threading

type Spinner() =
    let mutable running = false
    let mutable thread: Thread = null

    member this.Start(message: string) =
        if not running then
            running <- true

            thread <-
                Thread(fun () ->
                    let mutable i = 0
                    let frames = [| "-"; "\\"; "|"; "/" |]

                    while running do
                        Console.Write($"\r{frames.[i % 4]} {message}")
                        Thread.Sleep(100)
                        i <- i + 1)

            thread.Start()

    member this.Stop() =
        if running then
            running <- false
            thread.Join()
            Console.Write("\r")
            Console.Out.Flush()
