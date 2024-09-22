module ProgramTests

open Xunit
open FsUnit.Xunit
open Program

[<Fact>]
let ``getVersion should return correct version format`` () =
    let version = getVersion ()
    version |> should startWith "khadim"
    version.Split('.') |> Array.length |> should be (greaterThanOrEqualTo 3)

[<Theory>]
[<InlineData("--version")>]
[<InlineData("-v")>]
let ``main should return 0 for version flag`` (flag: string) =
    let result = main [| flag |]
    result |> should equal 0

[<Theory>]
[<InlineData("--help")>]
[<InlineData("-h")>]
let ``main should return 0 for help flag`` (flag: string) =
    let result = main [| flag |]
    result |> should equal 0

[<Fact>]
let ``main should return 1 for invalid flag`` () =
    let result = main [| "--invalid-flag" |]
    result |> should equal 1

// Note: The following tests are commented out because they would actually run the commands.
// In a real scenario, you'd want to mock these operations or use a test environment.

(*
[<Fact>]
let ``main should return 0 for reset flag`` () =
    let result = main [| "--reset" |]
    result |> should equal 0

[<Fact>]
let ``main should return 0 for clean flag`` () =
    let result = main [| "--clean" |]
    result |> should equal 0

[<Fact>]
let ``main should return 0 for init flag`` () =
    let result = main [| "--init" |]
    result |> should equal 0

[<Fact>]
let ``main should return 0 for doctor flag`` () =
    let result = main [| "--doctor" |]
    result |> should equal 0
*)

[<Fact>]
let ``main should return 0 when no arguments are provided`` () =
    let result = main [||]
    result |> should equal 0
